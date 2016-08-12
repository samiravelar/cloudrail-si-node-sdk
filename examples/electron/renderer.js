const cloudrail = require("cloudrail-si");
const {BrowserWindow} = require("electron").remote;

const logoutButton = document.getElementById("logout-button");
const spaceButton = document.getElementById("space-button");
const spacePane = document.getElementById("space-pane");

const DB_CREDS = "dropboxCredentials";

const clientId = "[clientID]";
const clientSecret = "[clientSecret]";
const redirectUrl = "http://localhost:12345/auth"; // can be any redirect URL registered in your Dropbox app
const state = "state";

const dropbox = new cloudrail.services.Dropbox(
	cloudrail.RedirectReceivers.getElectronAuthenticator(BrowserWindow, redirectUrl), 
	clientId, 
	clientSecret, 
	redirectUrl, 
	state
);

// Restore credentials if present
let credentials = window.localStorage.getItem(DB_CREDS);
if (credentials) dropbox.loadAsString(credentials);

spaceButton.addEventListener("click", event => {
	spacePane.textContent = "Please wait";
	dropbox.getAllocation((err, allocation) => {
		if (err) {
			spacePane.textContent = "Could not get space allocation";
		} else {
			window.localStorage.setItem(DB_CREDS, dropbox.saveAsString()); // save/update credentials persistently to avoid unnecessary logins
			spacePane.textContent = "Space used in Bytes: " + allocation.used + " of " + allocation.total;
		}
	});
});

logoutButton.addEventListener("click", event => {
	dropbox.logout(); // make the dropbox object forget about the user
	window.localStorage.removeItem(DB_CREDS); // remove the credentials from localstorage
});
