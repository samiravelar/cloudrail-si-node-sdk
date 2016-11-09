/**
 * This example demonstrates how to setup an express server with a connetion to a Mongo DB to work with the CloudRail services that use OAuth
 * It uses "login with" Twitter and Facebook as an example
 * For brevity, it does insufficient error checking and should thus not be used in production unmodified
 * MongoDB needs to be installed and the credentials all filled in with proper values
 *
 * Start the server and visit http://localhost:12345
 */
"use strict";
const crypto = require("crypto");
const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const cloudrail = require("cloudrail-si");
const User = require("./database-models/UserModel");

const app = express();
app.use(cookieParser());
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test-db");
cloudrail.Settings.setKey("[Put CloudRail license key]"); // Get one at https://developers.cloudrail.com

// Serve login page
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/html/login.html");
});

// Serve home page
app.get("/", (req, res) => {
    let token = req.cookies.token;
    let identifier = req.cookies.identifier;
    User.findOne({ // Look for a user with the given ID and token in the database
        socialId: identifier,
        token: token
    }, (err, user) => {
        if (user) { // We found the user
            let serviceName = identifier.split("-")[0];
            let service = makeService(serviceName); // Make the service the user is logged in with
            service.loadAsString(user.credentials); // Skip authentication by loading the saved credentials
            service.getPictureURL((err, url) => { // Get the newest profile picture and redirect to it
                res.redirect(url);
            });
        } else { // Illegal access, redirect to login page
            res.redirect("/login");
        }
    });
});

// Starts authentication when navigated to
app.get("/auth/start/:serviceName", (req, res) => {
    let serviceName = req.params["serviceName"]; // Get the name of the service to authenticate with
    let redirectReceiver = (url) => { // Called during "service.login()"
        res.redirect(url); // Present the login page to the user by redirecting them to it
    };
    let service = makeService(serviceName, redirectReceiver); // Initialize the correct service
    service.login(); // Start login. Won't complete since the redirectReceiver never calls its callback
});

// Receives authentication redirects
app.get("/auth/redirect/:serviceName", (req, res) => {
    let serviceName = req.params["serviceName"]; // Get the name of the service to authenticate with
    let redirectReceiver = (url, state, callback) => { // Called during "service.getIdentifier()" or any other call when not yet authenticated
        callback(undefined, "http://bla.com" + req.url); // Feed the incoming path as part of a complete URL into the callback to finish authentication
    };
    let service = makeService(serviceName, redirectReceiver); // Initialize the correct service
    service.getIdentifier((err, identifier) => { // Finishes login and gets a unique identifier for the logged in user
        User.findOne({ // Look for the user in the database
            socialId: identifier
        }, (err, user) => {
            if (user) { // If found we know this is an existing user
                respondSession(res, user);
            } else { // If not found, we know that this is a new user
                service.getFullName((err, fullName) => { // We retrieve the user's full name and save it on signup so it stays constant
                    let user = new User({
                        socialId: identifier,
                        fullName: fullName,
                        token: crypto.randomBytes(16).toString("hex"),
                        credentials: service.saveAsString() // Save the credentials so a picture URL can be retrieved freshly on every visit
                    });
                    user.save((err) => { // And save the user to the database
                        respondSession(res, user);
                    });
                });
            }
        });
    });
});

app.listen(12345);

function respondSession(res, user) {
    res.cookie("identifier", user.socialId); // Set the ID as a cookie
    res.cookie("token", user.token); // Set the token as a cookie
    res.redirect("/"); // Redirect to home
}

function makeService(name, redirectReceiver) {
    let service;
    switch (name) {
        case "twitter":
            service = new cloudrail.services.Twitter( // See https://documentation.cloudrail.com/nodejs/nodejs/Services#twitter for instructions on how to get these credentials
                redirectReceiver,
                "[Put Twitter Client ID]",
                "[Put Twitter Client Secret]",
                "http://localhost:12345/auth/redirect/twitter"
            );
            break;
        case "facebook":
            service = new cloudrail.services.Facebook( // See https://documentation.cloudrail.com/nodejs/nodejs/Services#facebook for instructions on how to get these credentials
                redirectReceiver,
                "[Put Facebook Client ID]",
                "[Put Facebook Client Secret]",
                "http://localhost:12345/auth/redirect/facebook",
                "state"
            );
            break;
        // More services from the Profile interface can be added here, the services above are just examples
        default: throw new Error("Unrecognized service");
    }
    return service;
}