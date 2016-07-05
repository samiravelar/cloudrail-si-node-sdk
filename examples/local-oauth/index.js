const http = require("http");
const opn = require("opn");
const services = require("cloudrail-si").services;

const port = 12345;

// This implementation of redirectReceiver opens a server on localhost and then uses the local browser to present the authentication and redirect to localhost
let redirectReceiver = (url, state, callback) => {
    let server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.end("<h1>This window can be closed</h1>");
        server.close(); // This won't immediately close the server, just prevent it from taking new connections
        callback(req.url);
    });
    server.listen(port);

    opn(url);
};

// The Dropbox application with the given client ID and secret (replace "xxx") must have the redirect URI "http://localhost:12345/auth" registered
let cs = new services.Dropbox(redirectReceiver, "xxx", "xxx", "http://localhost:" + port + "/auth", "state");


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