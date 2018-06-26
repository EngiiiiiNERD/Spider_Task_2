var mongoose = require("mongoose");

var TodoSchema = new mongoose.Schema({
   title:String,
   notes:String
});

module.exports = mongoose.model("Todo",TodoSchema);