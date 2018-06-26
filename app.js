     var express               = require("express");
     var app                   = express();
     var mongoose              = require("mongoose");
     var bodyParser            = require("body-parser");
     var passport              = require("passport");
     var LocalStrategy         = require("passport-local");
     var passportLocalMongoose = require("passport-local-mongoose");
     var User                  = require("./models/user");  
     var Info                  = require("./models/info");
     var Todo                  = require("./models/todo");
     var Task                  = require("./models/task");
     var CurrentUser;
     var datetime = require('node-datetime');

mongoose.connect("mongodb://localhost/auth");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(require("express-session")({
    secret:"Rusty is best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//INITIAL SETUP-----------------------------------------------------------------


app.get("/",function(req,res){
    console.log(datetime.create()[0] + "IS THE TIME OF CREATION");
    res.render("home");       
});
//Working on it ==========================================================================================  
// app.post("/updatetodo",function(req,res){
//    console.log("Title "+ req.body.title);
//    console.log("TODOID "+ req.body.todoId);
//    console.log("DATE "+ req.body.date);
//    console.log("STATUS "+ req.body.status);
//    console.log("USERNAME "+ req.body.username);
   
//    res.send("Updated Status");
// });

app.post("/updatetodo",function(req,res){
          Todo.remove({title : req.body.title},function(err,removesTitle){
                    console.log(removesTitle[0] + "+++++++++++++++++++++++++++++++");
          });
         Info.find({userinfo : req.body.username},function(err,newdata){
            if(err){
                      console.log(err);
            }else{
                      Task.create({
                                newtitle : req.body.title,
                                newnotes : req.body.date
                               
                      },function(err,newdoc){
                                if(err){
                                          console.log(err);
                                }else{
                                          
                                          newdata[0].finishedtask.push(newdoc);
                                          newdata[0].save();
                                          console.log(newdata + "This is data  after update");
                                          console.log(newdoc + "This is doc after update");
                                          Info.find({userinfo : newdata[0].userinfo},function(err,finduser){
                                           console.log(finduser + "Final result after update");  
                                           console.log(newdata[0]._id);
                                           Info.findById(newdata[0]._id).populate("finishedtask").exec(function(err,UpdatedTodo){
                                              console.log("Allthe Notes are after update "+ UpdatedTodo);       
                                               res.render("finishedtodolist",{ z : UpdatedTodo , newname : newdata[0]});
                                           });
                                          

                                          });
                                          
                                }         //End of second else statement
                      });
            }       //Endof first else statement
         });
}); 
//UPDATING TODO LIST

app.get("/home/:id",function(req,res){
          Info.find({userinfo : CurrentUser},function(err,information){
                    if(err){
                              console.log(err);
                    }else{                     
                            res.render("addtodo",{ x : information});          
                    }
          });
     });

app.post("/refreshToDo",function(req,res){
      Info.find({userinfo : req.body.username},function(err,Latestdata){
          if(err){
                    console.log(err);
          }else{
                Info.findById(req.body.id).populate("usernotes").exec(function(err,LatestUpdatedTodo){
                   console.log("HEYYYYYYYYYYYYYYYYY " + LatestUpdatedTodo );
                    res.render("todolist",{ y : LatestUpdatedTodo});
                });    
          }       
      });    
});


app.post("/home/:id",function(req,res){
         Info.find({userinfo : req.body.username},function(err,data){
            if(err){
                      console.log(err);
            }else{
                      Todo.create({
                                title : req.body.title,
                                notes : req.body.date,
                                
                      },function(err,doc){
                                if(err){
                                          console.log(err);
                                }else{
                                          data[0].usernotes.push(doc);
                                          data[0].save();
                                          console.log(data + "This is data");
                                          console.log(doc + "This is doc");
                                          Info.find({userinfo : data[0].userinfo},function(err,finduser){
                                           console.log(finduser + "Final result");  
                                           console.log(data[0]._id);
                                           Info.findById(data[0]._id).populate("usernotes").exec(function(err,UpdatedTodo){
                                              console.log("Allthe Notes are "+ UpdatedTodo); 
                                              res.render("todolist",{ y : UpdatedTodo});
                                           });
                                          

                                          });
                                          
                                }         //End of second else statement
                      });
            }       //Endof first else statement
         });
});     



app.post("/check",function(req,res){
    if(CurrentUser == req.body.x ){
             Info.find({userinfo : CurrentUser},function(err,user_id){
                       if(err){
                                 console.log(err);
                       }else{    
                                 res.redirect("/home/" + user_id[0]._id );
                       }
             });
   }else{        
             res.redirect("/login");
   }      

});

app.get("/happy",isLoggedIn,function(req,res){
     Info.find({},function(err,data){
     if(err){
                console.log(err);
     }else{     
                
                console.log(data + "Latest data");   
                res.render("show",{data : data});               
          }       
   });          
         
});
//------------------------------------------------------------------------------
//SignUp form
app.get("/register",function(req,res){
   res.render("register");       
});

//Handeling user sign up
app.post("/register/show",function(req,res){
          //req.body.password
          User.register(new User({username : req.body.username}),req.body.password,function(err,user){
          if(err){
                console.log(err);
                return res.render("register");
          } 
          passport.authenticate("local")(req,res,function(){
                //register the new user to the data base          
                var name = req.body.username;
                CurrentUser = req.body.username;
                
          Info.create({
                userinfo : name
          },function(err,data){
          if(err){
                console.log(err);
          }else{   
                res.redirect("/happy");
              }      
          });
      });
   });
});

//LOGIN ROUTES
app.get("/login",function(req,res){
          res.render("login");    
});

//Login logic
app.post('/login', passport.authenticate('local', { 
          failureRedirect: '/login'
          }),
  function(req, res) {
            CurrentUser = req.body.username;
            res.redirect("/happy");
});

app.get("/logout",function(req,res){
   CurrentUser = "";
   console.log(CurrentUser + " IS THE CURRENT USER");
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req,res,next){
          if(req.isAuthenticated()){
                    return next();
          }
          res.redirect("/login");
}

app.listen(3000,function(){
          console.log("Server Is Ready");
});

