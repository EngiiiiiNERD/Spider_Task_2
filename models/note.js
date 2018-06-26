var mongoose = require("mongoose");

var NoteSchema = new mongoose.Schema({
   title:String,
   notes:String
});

module.exports = mongoose.model("Note",NoteSchema);