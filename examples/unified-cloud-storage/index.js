var emoji = null;
try { emoji = require('console-emoji') } catch(e) {}
var fs = require('fs');
var cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail Key]");

var port = 8082; // or any other free port on the local machine

//const service = new cloudrail.services.Box(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Box Client Identifier]", "[Box Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.Dropbox(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Dropbox Client Identifier]", "[Dropbox Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.Egnyte(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Your Egnyte Domain]", "[Your Egnyte API Key]", "[Your Egnyte Shared Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.GoogleDrive(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Google Drive Client Identifier]", "[Google Drive Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.OneDrive(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[OneDrive Client Identifier]", "[OneDrive Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.OneDriveBusiness(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[OneDrive Business Client Identifier]", "[OneDrive Business Client Secret]", "http://localhost:" + port + "/", "someState");

var currentPath = "/";
showPath(currentPath);

var stdin = process.openStdin();
stdin.addListener("data", function(d){ processInput(d); });



function processInput(d) {
    var data = d.toString().trim().split(" ");
    var cmd = data[0].toLowerCase();

    switch(cmd) {
      case "help":
        showHelp();
        break;
      case "cd":
        cd(data.slice(1).join(" "));
        break;
      case "download":
        download(data.slice(1).join(" "));
        break;
      default:
        console.log("Unknown command. Try entering \"help\".\n");
    }
}

function showHelp() {
  console.log("Possible commands:");
  console.log("\"help\" displays this help.");
  console.log("\"cd relativePath\" opens a folder, where relativePath is its path starting from the currently displayed folder.");
  console.log("\"cd ..\" goes to the current folder's parent folder.");
  console.log("\"download fileName\" downloads the respective file from the currently displayed folder.");
  console.log("");
}

function showPath(path) {
  console.log("==============================");
  console.log("showing folder " + path);
  console.log("==============================");
  service.getChildren(
    path,
    (error, result) => {
      if (error) { console.log(error); }
      else {
        var sortedResult = result.sort(function(a, b){return a.name.localeCompare(b.name);});
        for (var i = 0; i < sortedResult.length; i++) {
          printFileOrFolder(sortedResult[i].name, sortedResult[i].folder);
        }
        console.log("");
        console.log("");
      }
    }
  );
}

function cd(change) {
  if (change == "..") {
    var path = currentPath.split("/");
    path = path.slice(0, path.length-1);
    path = path.join("/");
    if (path == "") {
      path = "/";
    }
    currentPath = path;
    showPath(path);
  } else {
    if (currentPath != "/") {
      currentPath = currentPath + "/";
    }
    currentPath = currentPath + change;
    showPath(currentPath);
  }
}

function download(fileName) {
  var fullName;
  if (currentPath == "/") { fullName = "/" + fileName; }
  else { fullName = currentPath + "/" + fileName; }
  service.download(
    fullName,
    (error, readStream) => {
      if (error) { console.log(error); }
      else {
        var writeStream = fs.createWriteStream("downloads/" + fileName, { flags : 'w' });
        readStream.pipe(writeStream);
        writeStream.on('close', function () {
          console.log('File ' + fullName + ' downloaded!\n');
        });
      }
    }
  )
}

function printFileOrFolder(name, folder) {
  if (emoji == null) {
    if (folder) { console.log("folder   " + name); }
    else        { console.log("file     " + name); }
  } else {
      if (folder) { emoji(":open_file_folder:   " + name); }
      else        { emoji(":memo:   " + name); }
  }
}
