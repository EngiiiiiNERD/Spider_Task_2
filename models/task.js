var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
   newtitle:String,
   newnotes:String
});

module.exports = mongoose.model("Task",TaskSchema);