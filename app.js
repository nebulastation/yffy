var express = require("express");
    app = express();
    bodyParser = require("body-parser");
    mongoose = require("mongoose");
    passport = require("passport");
    Arena = require("./models/arena");
    Comment = require("./models/comment");
    LocalStrategy = require("passport-local");
    User = require("./models/user");
    methodOverride = require("method-override");
    port = process.env.PORT || 3000;
    url = process.env.DATABASEURL || "mongodb://localhost:27017/arenas";
    // flash = require("connect-flash");
    
//routes    
var commentRoutes = require("./routes/comments");
    arenaRoutes = require("./routes/arenas");
    authRoutes = require("./routes/auth");

mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://connie:placeholder@arenas-tiqmi.azure.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "flower crazy in my head",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});


app.use(authRoutes);
app.use("/arenas/:id/comments", commentRoutes);
app.use("/arenas", arenaRoutes);


app.listen(port, process.env.IP, function(){
    console.log("arenas started");
});