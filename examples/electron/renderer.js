const cloudrail = require("cloudrail-si");
const fs = require("fs");
const {licenseKey, dbCredentials, gdCredentials, boxCredentials, odCredentials} = require("./config.js");
const {BrowserWindow} = require("electron").remote;
const {dialog} = require('electron').remote;

cloudrail.Settings.setKey(licenseKey);

const STATE = "state";
const DB_AUTH = "dbauth";
const BOX_AUTH = "boxauth";
const GD_AUTH = "gdauth";
const OD_AUTH = "odauth";

const fileList = document.getElementById("file-list");
const uploadBtn = document.getElementById("upload");
const dbBtn = document.getElementById("dropbox-btn");
const boxBtn = document.getElementById("box-btn");
const gdBtn = document.getElementById("googledrive-btn");
const odBtn = document.getElementById("onedrive-btn");

let currentService;


// ---------------------------------------------------------------------------------------------------
// 									INSTANTIATE SERVICES
// ---------------------------------------------------------------------------------------------------


const dropbox = new cloudrail.services.Dropbox(
	cloudrail.RedirectReceivers.getElectronAuthenticator(BrowserWindow, dbCredentials.redirectUri), 
	dbCredentials.clientId, 
	dbCredentials.clientSecret, 
	dbCredentials.redirectUri, 
	STATE
);
// Restore credentials if present
if (window.localStorage.getItem(DB_AUTH)) dropbox.loadAsString(window.localStorage.getItem(DB_AUTH));

const box = new cloudrail.services.Box(
	cloudrail.RedirectReceivers.getElectronAuthenticator(BrowserWindow, boxCredentials.redirectUri), 
	boxCredentials.clientId, 
	boxCredentials.clientSecret, 
	boxCredentials.redirectUri, 
	STATE
);
// Restore credentials if present
if (window.localStorage.getItem(BOX_AUTH)) box.loadAsString(window.localStorage.getItem(BOX_AUTH));

const googledrive = new cloudrail.services.GoogleDrive(
	cloudrail.RedirectReceivers.getElectronAuthenticator(BrowserWindow, gdCredentials.redirectUri), 
	gdCredentials.clientId, 
	gdCredentials.clientSecret, 
	gdCredentials.redirectUri, 
	STATE
);
// Restore credentials if present
if (window.localStorage.getItem(GD_AUTH)) googledrive.loadAsString(window.localStorage.getItem(GD_AUTH));

const onedrive = new cloudrail.services.OneDrive(
	cloudrail.RedirectReceivers.getElectronAuthenticator(BrowserWindow, odCredentials.redirectUri), 
	odCredentials.clientId, 
	odCredentials.clientSecret, 
	odCredentials.redirectUri, 
	STATE
);
// Restore credentials if present
if (window.localStorage.getItem(OD_AUTH)) onedrive.loadAsString(window.localStorage.getItem(OD_AUTH));


// ---------------------------------------------------------------------------------------------------
// 											ON CLICK LISTENERS
// ---------------------------------------------------------------------------------------------------


dbBtn.addEventListener("click", event => {
	triggerService(dropbox, DB_AUTH);
});

boxBtn.addEventListener("click", event => {
	triggerService(box, BOX_AUTH);
});

gdBtn.addEventListener("click", event => {
	triggerService(googledrive, GD_AUTH);
});

odBtn.addEventListener("click", event => {
	triggerService(onedrive, OD_AUTH);
});

uploadBtn.addEventListener("click", event => {
	// Open a dialog to allow the user to select a file
	dialog.showOpenDialog((fileNames) => {
		if(fileNames === undefined) {
			return;
		}

		let path = fileNames[0];
		let pathComponents = path.split("/");
		let fileName = pathComponents[pathComponents.length - 1];
		let stats = fs.statSync(path);
		let fileSize = stats.size;
		let stream = fs.createReadStream(path);

		currentService.upload("/" + fileName, stream, fileSize, false, (err) => {
			if(err) {
				dialog.showErrorBox("Error", "Upload failed, please try again!");
				return;
			}

			addFile({
				name: fileName,
				folder: false
			});
		});
	});
});


// ---------------------------------------------------------------------------------------------------
// 										HELPER METHODS
// ---------------------------------------------------------------------------------------------------


function triggerService(service, tag) {
	service.getChildren("/", (err, files) => {
		if (err) {
			console.log(JSON.stringify(err));
		} else {
			window.localStorage.setItem(tag, service.saveAsString()); // save/update credentials persistently to avoid unnecessary logins
			displayFiles(files);
			currentService = service;
		}
	});
}

function displayFiles(files) {
	while(fileList.firstChild) {
		fileList.removeChild(fileList.firstChild);
	}

	files.forEach(addFile);
}

function addFile(file) {
	let li = document.createElement("li");
	li.textContent = file.name;
	fileList.appendChild(li);

	if(!file.folder) {
		li.setAttribute("style", "cursor: pointer; color: blue");
		li.addEventListener("click", saveFile(file.name));
	}
}

function saveFile(fileName) {
	return function() {
		dialog.showSaveDialog({
			defaultPath: fileName
		}, (path) => {
			if(path === undefined) {
				return;
			}

			currentService.download("/" + fileName, (err, stream) => {
				if(err) {
					dialog.showErrorBox("Error", "Download failed, please try again!");
					return;
				}

				stream.on("end", () => {
					dialog.showMessageBox({
						type: "info",
						title: "Success",
						message: "File saved successfully!"
					});
				});
				let writeStream = fs.createWriteStream(path);
				stream.pipe(writeStream);
			});
		});
	};
}
