const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    socialId: String,
    fullName: String,
    token: String,
    credentials: String
});

module.exports = mongoose.model("User", UserSchema);