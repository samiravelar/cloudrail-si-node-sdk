/**
 * Simple example of authenticating CloudStorage services on a server
 * Visit localhost:12345/auth/start/dropbox, localhost:12345/auth/start/onedrive, ... to launch the flow
 */
const express = require("express");
const app = express();
const cloudrail = require("cloudrail-si");

cloudrail.Settings.setKey("[CloudRail license key]");

app.get("/auth/start/:serviceName", (req, res) => {
    let serviceName = req.params["serviceName"];
    let redirectReceiver = (url, state, callback) => {
        res.redirect(url);
    };
    let service = makeService(serviceName, redirectReceiver, "state"); // You can change the last parameter if you need to identify incoming redirects
    service.login();
});

app.get("/auth/redirect/:serviceName", (req, res) => {
    let serviceName = req.params["serviceName"];
    let redirectReceiver = (url, state, callback) => {
        callback(undefined, "http://bla.com" + req.url); // The callback expects a complete URL but only the query matters
    };
    let service = makeService(serviceName, redirectReceiver, "state");
    service.login((err) => {
        if (err) throw err;
        // Now we are logged in, let's respond with the files in root
        service.getChildren("/", (err, children) => {
            if (err) throw err;
            let childrenNames = [];
            for (let child of children) {
                childrenNames.push(child.name);
            }
            res.send("The files and folders in " + serviceName + " root are: " + childrenNames.join(", "));
        });
    });
});

app.listen(12345);

function makeService(name, redirectReceiver, state) {
    let service;
    switch (name) {
        case "dropbox":
            service = new cloudrail.services.Dropbox(
                redirectReceiver,
                "[Dropbox Client ID]",
                "[Dropbox Client Secret]",
                "http://localhost:12345/auth/redirect/dropbox", // Make sure your Dropbox app has this set as an allowed redirect URI
                state
            );
            break;
        case "onedrive":
            service = new cloudrail.services.OneDrive(
                redirectReceiver,
                "[OneDrive Client ID]",
                "[OneDrive Client Secret]",
                "http://localhost:12345/auth/redirect/onedrive", // Make sure your OneDrive app has this set as an allowed redirect URI
                state
            );
            break;
        // More services from CloudStorage can be added here, the services above are just examples
        default: throw new Error("Unrecognized service");
    }
    return service;
}