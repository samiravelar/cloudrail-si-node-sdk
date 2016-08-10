"use strict";
var http = require("http");
var opn = require("opn");
var RedirectReceivers = (function () {
    function RedirectReceivers() {
    }
    RedirectReceivers.getLocalAuthenticator = function (port, respHtml) {
        if (port === void 0) { port = 12345; }
        if (respHtml === void 0) { respHtml = "<h2>Authentication successful, you can close this window now</h2>"; }
        return function (url, state, callback) {
            var sockets = {};
            var nextSocketId = 0;
            var server = http.createServer(function (req, res) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");
                res.end(respHtml);
                server.close(function () { return callback(req.url); });
                for (var socketId in sockets)
                    sockets[socketId].destroy();
            });
            server.on("connection", function (socket) {
                var socketId = nextSocketId++;
                sockets[socketId] = socket;
                socket.on("close", function () { return delete sockets[socketId]; });
            });
            server.listen(port);
            opn(url);
        };
    };
    return RedirectReceivers;
}());
exports.RedirectReceivers = RedirectReceivers;
