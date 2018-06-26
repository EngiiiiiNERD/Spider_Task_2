var mongoose = require("mongoose");

var InfoSchema = new mongoose.Schema({
       userinfo : String,
       timeOfCreation : {type: Date , default : Date.now},
       usernotes : [
                    {
                   type:mongoose.Schema.Types.ObjectId,
                   ref:"Todo"
                    }
           ],
         finishedtask : [
                    {
                   type:mongoose.Schema.Types.ObjectId,
                   ref:"Task"
                    }
           ]   
});

module.exports = mongoose.model("Info",InfoSchema);