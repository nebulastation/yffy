var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

//show reg form
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            // req.flash("success", "signed you up, " + user.username);
            res.redirect("/arenas");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/arenas",
    failureRedirect: "/login"
}), function(req, res){
    
});

//logout
router.get("/logout", function(req, res){
    req.logout();
    // req.flash("success", "logged you out");
    res.redirect("/arenas");
})

module.exports = router;