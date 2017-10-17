"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var Helper_1 = require("../helpers/Helper");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "init": [
        ["string.concat", "$P0.baseURL", "https://chatapi.viber.com/pa"]
    ],
    "setWebhook": [
        ["create", "$L0", "Object"],
        ["string.concat", "$L0.url", "$P0.baseURL", "/set_webhook"],
        ["set", "$L0.method", "POST"],
        ["create", "$L3", "Array"],
        ["push", "$L3", "delivered"],
        ["push", "$L3", "seen"],
        ["create", "$L4", "Object"],
        ["set", "$L4.url", "$P0.webhook"],
        ["set", "$L4.event_types", "$L3"],
        ["json.stringify", "$L4", "$L4"],
        ["size", "$L20", "$L4"],
        ["string.concat", "$L21", "$L20"],
        ["create", "$L2", "Object"],
        ["set", "$L2", "$P0.botToken", "X-Viber-Auth-Token"],
        ["set", "$L2", "application/json", "Content-Type"],
        ["set", "$L2", "$L21", "Content-Length"],
        ["set", "$L0.requestHeaders", "$L2"],
        ["stream.stringToStream", "$L0.requestBody", "$L4"],
        ["http.requestCall", "$L0", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L0"]
    ],
    "processWebhookRequest": [
        ["json.parse", "$L0", "$P2"],
        ["if!=than", "$L0.event", "message", 1],
        ["return"],
        ["set", "$L3", null],
        ["set", "$L2", "$L0.message.location"],
        ["if!=than", "$L2", null, 3],
        ["create", "$L3", "Location"],
        ["set", "$L3.Longitude", "$L2.lng"],
        ["set", "$L3.Latitude", "$L2.lat"],
        ["set", "$L4", null],
        ["if!=than", "$L0.message.type", "text", 6],
        ["create", "$L4", "Array"],
        ["set", "$L8", "$L0.message.type"],
        ["if==than", "$L8", "picture", 1],
        ["set", "$L8", "image"],
        ["create", "$L5", "MessagingAttachment", "$L0.message.media", "$L8", null, null, null],
        ["push", "$L4", "$L5"],
        ["create", "$L6", "Message"],
        ["if!=than", "$L0.message_token", null, 2],
        ["string.concat", "$L11", "$L0.message_token"],
        ["set", "$L6.MessageId", "$L11"],
        ["if!=than", "$L0.sender.id", null, 3],
        ["string.concat", "$L12", "$L0.sender.id"],
        ["set", "$L6.SenderId", "$L12"],
        ["set", "$L6.ChatId", "$L12"],
        ["if!=than", "$L0.user_id", null, 3],
        ["string.concat", "$L14", "$L0.sender.id"],
        ["set", "$L6.SenderId", "$L14"],
        ["set", "$L6.ChatId", "$L14"],
        ["create", "$L7", "Date"],
        ["set", "$L7", "$L7.time"],
        ["set", "$L6.SendAt", "$L7"],
        ["if!=than", "$L0.message.text", null, 2],
        ["string.concat", "$L15", "$L0.message.text"],
        ["set", "$L6.MessageText", "$L15"],
        ["if!=than", "$L3", null, 1],
        ["set", "$L6.Location", "$L3"],
        ["if!=than", "$L4", null, 1],
        ["set", "$L6.Attachments", "$L4"],
        ["create", "$P1", "Array"],
        ["push", "$P1", "$L6"]
    ],
    "sendMessage": [
        ["callFunc", "checkMandatory", "$P0", "$P2", "chatId"],
        ["callFunc", "checkMandatory", "$P3", "message text"],
        ["callFunc", "send", "$P0", "$P1", "$P2", "text", "$P3", null, null, null, null]
    ],
    "sendImage": [
        ["callFunc", "checkMandatory", "$P0", "$P2", "chatId"],
        ["callFunc", "checkMandatory", "$P4", "content URL"],
        ["if==than", "$P6", null, 1],
        ["set", "$P6", "https://webhooks.cloudrail.com/home/ubuntu/server/media/cloudrail_small_preview_viber.jpg"],
        ["callFunc", "send", "$P0", "$P1", "$P2", "picture", "$P3", "$P4", "$P6", null, null]
    ],
    "sendVideo": [
        ["callFunc", "checkMandatory", "$P0", "$P2", "chatId"],
        ["callFunc", "checkMandatory", "$P4", "content URL"],
        ["callFunc", "checkMandatory", "$P7", "video size"],
        ["if==than", "$P6", null, 1],
        ["set", "$P6", "https://webhooks.cloudrail.com/home/ubuntu/server/media/cloudrail_small_preview_viber.jpg"],
        ["callFunc", "send", "$P0", "$P1", "$P2", "video", "$P3", "$P4", "$P6", null, "$P7"]
    ],
    "sendAudio": [
        ["callFunc", "checkMandatory", "$P0", "$P2", "chatId"],
        ["callFunc", "checkMandatory", "$P4", "content URL"],
        ["callFunc", "checkMandatory", "$P7", "mp3 file name"],
        ["callFunc", "checkMandatory", "$P8", "file size"],
        ["callFunc", "send", "$P0", "$P1", "$P2", "file", null, "$P4", null, "$P7", "$P8"]
    ],
    "sendFile": [
        ["callFunc", "checkMandatory", "$P0", "$P2", "chatId"],
        ["callFunc", "checkMandatory", "$P4", "content URL"],
        ["callFunc", "checkMandatory", "$P7", "file name"],
        ["callFunc", "checkMandatory", "$P8", "file size"],
        ["callFunc", "send", "$P0", "$P1", "$P2", "file", null, "$P4", null, "$P7", "$P8"]
    ],
    "downloadContent": [
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "GET"],
        ["string.concat", "$L0.url", "$P2.id"],
        ["create", "$L1", "Object"],
        ["http.requestCall", "$L1", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L1"],
        ["set", "$P1", "$P2"],
        ["set", "$P1.stream", "$L1.responseBody"],
        ["set", "$P1.mimeType", "$L1.responseHeaders.Content-Type"]
    ],
    "send": [
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "POST"],
        ["string.concat", "$L0.url", "$P0.baseURL", "/send_message"],
        ["create", "$L5", "Object"],
        ["set", "$L5.name", "$P0.botName"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L20", "$P2"],
        ["set", "$L1.receiver", "$L20"],
        ["set", "$L1.type", "$P3"],
        ["set", "$L1.sender", "$L5"],
        ["if!=than", "$P4", null, 1],
        ["set", "$L1.text", "$P4"],
        ["if!=than", "$P5", null, 1],
        ["set", "$L1.media", "$P5"],
        ["if!=than", "$P6", null, 1],
        ["set", "$L1.thumbnail", "$P6"],
        ["if!=than", "$P7", null, 1],
        ["set", "$L1.file_name", "$P7"],
        ["if!=than", "$P8", null, 1],
        ["set", "$L1.size", "$P8"],
        ["json.stringify", "$L1", "$L1"],
        ["stream.stringToStream", "$L0.requestBody", "$L1"],
        ["size", "$L20", "$L1"],
        ["string.concat", "$L21", "$L20"],
        ["create", "$L2", "Object"],
        ["set", "$L2", "$P0.botToken", "X-Viber-Auth-Token"],
        ["set", "$L2", "application/json", "Content-Type"],
        ["set", "$L2", "$L21", "Content-Length"],
        ["set", "$L0.requestHeaders", "$L2"],
        ["create", "$L3", "Object"],
        ["http.requestCall", "$L3", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L3"],
        ["create", "$L4", "Date"],
        ["set", "$L8", "$L4.time"],
        ["create", "$P1", "Message"],
        ["set", "$P1.SenderId", "$P2"],
        ["set", "$P1.ChatId", "$P2"],
        ["set", "$P1.SendAt", "$L8"],
        ["if!=than", "$P4", null, 1],
        ["set", "$P1.MessageText", "$P4"]
    ],
    "checkMandatory": [
        ["if==than", "$P1", null, 3],
        ["string.concat", "$L1", "Field ", "$P2", " is mandatory"],
        ["create", "$L0", "Error", "$L1", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "validateResponse": [
        ["if>=than", "$P1.code", 400, 15],
        ["debug.out", "$P1.code"],
        ["stream.streamToString", "$L5", "$P1.responseBody"],
        ["debug.out", "$L5"],
        ["set", "$L2", ""],
        ["if==than", "$P1.code", 401, 2],
        ["create", "$L3", "Error", "$L2", "Authentication"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 404, 2],
        ["create", "$L3", "Error", "$L2", "NotFound"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 503, 2],
        ["create", "$L3", "Error", "$L2", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"]
    ]
};
var Viber = (function () {
    function Viber(redirectReceiver, botToken, webhook, botName) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("Viber");
        this.interpreterStorage["botToken"] = botToken;
        this.interpreterStorage["webhook"] = webhook;
        this.interpreterStorage["botName"] = botName;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    Viber.prototype.sendMessage = function (receiverId, message, callback) {
        Statistics_1.Statistics.addCall("Viber", "sendMessage");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("sendMessage", this.interpreterStorage, null, receiverId, message).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "sendMessage");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.sendImage = function (receiverId, message, imageId, imageStream, previewUrl, mimeType, callback) {
        Statistics_1.Statistics.addCall("Viber", "sendImage");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("sendImage", this.interpreterStorage, null, receiverId, message, imageId, imageStream, previewUrl, mimeType).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "sendImage");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.sendVideo = function (receiverId, message, videoId, videoStream, previewUrl, size, callback) {
        Statistics_1.Statistics.addCall("Viber", "sendVideo");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("sendVideo", this.interpreterStorage, null, receiverId, message, videoId, videoStream, previewUrl, size).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "sendVideo");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.sendAudio = function (receiverId, message, audioId, audioStream, previewUrl, audioName, size, callback) {
        Statistics_1.Statistics.addCall("Viber", "sendAudio");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("sendAudio", this.interpreterStorage, null, receiverId, message, audioId, audioStream, previewUrl, audioName, size).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "sendAudio");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.sendFile = function (receiverId, message, fileId, fileStream, previewUrl, fileName, size, callback) {
        Statistics_1.Statistics.addCall("Viber", "sendFile");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("sendFile", this.interpreterStorage, null, receiverId, message, fileId, fileStream, previewUrl, fileName, size).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "sendFile");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.parseReceivedMessages = function (httpRequest, callback) {
        Statistics_1.Statistics.addCall("Viber", "parseReceivedMessages");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("processWebhookRequest", this.interpreterStorage, null, httpRequest).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "parseReceivedMessages");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.downloadContent = function (attachment, callback) {
        Statistics_1.Statistics.addCall("Viber", "downloadContent");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("downloadContent", this.interpreterStorage, null, attachment).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "downloadContent");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.advancedRequest = function (specification, callback) {
        Statistics_1.Statistics.addCall("Viber", "advancedRequest");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("AdvancedRequestSupporter:advancedRequest", this.interpreterStorage, null, specification).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Viber", "advancedRequest");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Viber.prototype.saveAsString = function () {
        Statistics_1.Statistics.addCall("Viber", "saveAsString");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    Viber.prototype.loadAsString = function (savedState) {
        Statistics_1.Statistics.addCall("Viber", "loadAsString");
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    Viber.prototype.resumeLogin = function (executionState, callback) {
        Statistics_1.Statistics.addCall("Viber", "resumeLogin");
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return Viber;
}());
exports.Viber = Viber;
