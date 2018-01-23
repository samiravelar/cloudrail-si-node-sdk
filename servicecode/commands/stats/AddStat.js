"use strict";
var Helper_1 = require("../../../helpers/Helper");
var Statistics_1 = require("../../../statistics/Statistics");
var AddStat = (function () {
    function AddStat() {
    }
    AddStat.prototype.getIdentifier = function () {
        return "stats.add";
    };
    AddStat.prototype.execute = function (environment, parameters) {
        Helper_1.Helper.assert(parameters.length === 2);
        var key = Helper_1.Helper.resolve(environment, parameters[0]);
        Helper_1.Helper.assert(Helper_1.Helper.isString(key));
        var value = Helper_1.Helper.resolve(environment, parameters[1]);
        Statistics_1.Statistics.setAdditionalStats(key, value);
    };
    return AddStat;
}());
exports.AddStat = AddStat;
