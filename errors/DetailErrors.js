"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AuthenticationError = (function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError() {
        _super.apply(this, arguments);
    }
    return AuthenticationError;
}(Error));
exports.AuthenticationError = AuthenticationError;
var HttpError = (function (_super) {
    __extends(HttpError, _super);
    function HttpError() {
        _super.apply(this, arguments);
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
var NotFoundError = (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError() {
        _super.apply(this, arguments);
    }
    return NotFoundError;
}(Error));
exports.NotFoundError = NotFoundError;
var ServiceUnavailableError = (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError() {
        _super.apply(this, arguments);
    }
    return ServiceUnavailableError;
}(Error));
exports.ServiceUnavailableError = ServiceUnavailableError;
var IllegalArgumentError = (function (_super) {
    __extends(IllegalArgumentError, _super);
    function IllegalArgumentError() {
        _super.apply(this, arguments);
    }
    return IllegalArgumentError;
}(Error));
exports.IllegalArgumentError = IllegalArgumentError;
