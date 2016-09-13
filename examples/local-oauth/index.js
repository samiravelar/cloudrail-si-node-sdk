const http = require("http");
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail license key]");

const port = 12345; // or any other free port on the local machine

// The Dropbox application with the given client ID and secret (replace "[...]") must have the redirect URI "http://localhost:12345" registered
let cs = new cloudrail.services.Dropbox(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port), // Opens a temporary server to accept redirects on http://localhost:[port]
    "[clientId]",
    "[clientSecret]",
    "http://localhost:" + port,
    "state"
);

const filePath = "/Image.jpeg"; // Should be a file that exists at the given location in Dropbox

let hash = require("crypto").createHash("md5");
hash.setEncoding("hex");

cs.download(filePath, (err, downStream) => {
    if (err) throw err;
    let upStream = downStream.pipe(hash);
    cs.upload(filePath + ".md5", upStream, 32, true, (err) => {
        if (err) throw err;
        console.log("Successfully hashed");
    });
});