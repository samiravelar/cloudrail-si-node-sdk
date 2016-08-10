const http = require("http");
const cloudrail = require("cloudrail-si");

const port = 12345; // or any other free port on the local machine

// The Dropbox application with the given client ID and secret (replace "[...]") must have the redirect URI "http://localhost:12345" registered
let cs = new cloudrail.services.Dropbox(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port), // Opens a temporary server to accept redirects on http://localhost:[port]
    "[clientId]",
    "[clientSecret]",
    "http://localhost:" + port,
    "state"
);


const filePath = "/Image.jpeg";
let zip = require("zlib").createGzip();

cs.download(filePath, (err, downStream) => {
    cs.getMetadata(filePath, (err, meta) => {
        let upStream = downStream.pipe(zip);
        cs.upload(filePath + ".zip", upStream, meta.size, true, (err) => {
            console.log("Successfully zipped");
        });
    });
});