const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    isAdmin: {type:Boolean, default:false},
}, {timestamps: true, strict:"throw"});

const Usermodel = mongoose.model("user", userSchema);

module.exports = Usermodel;
