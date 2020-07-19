var express = require("express");
var router = express.Router();
var Arena = require("../models/arena");
var middleware = require("../middleware");

//INDEX ROUTE - show all campgrounds
router.get("/", function(req, res){
    //get all campgrounds from db
    Arena.find({}, function(err, allArenas){
        if(err){
            console.log(err);
        } else {
            res.render("arenas/index", {arenas: allArenas, currentUser: req.user});
        }
    });
});

//NEW - form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("arenas/new");
});

//CREATE - add new campground to db - inside the post route we do something with the inputted data, then redirect to get request to view everything + changes
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newArena = {name: name, image: image, description: desc, author: author};
    //add to campgrounds array
    //create new campgrounds and save to DB (replace array method above)
    Arena.create(newArena, function(err, newlyCreated){
        if(err){
            // req.flash("error", "Arena not found");
            console.log(err);
        } else {
            //redirect back to campgrounds page - default is to redirect to get request
            res.redirect("/arenas");
            console.log(newlyCreated);
        }
    });
});

//SHOW - show info about one campground - IMP! put this after /campgrounds/new route otherwise those routes will be treated as show route
router.get("/:id", function(req, res){
    //find campground with provided ID
    Arena.findById(req.params.id).populate("comments").exec(function(err, foundArena){
        if(err){
            // req.flash("error", "Campground not found");
            console.log(err);
        } else {
            //render show template with that campground
            res.render("arenas/show", {arena: foundArena});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
        Arena.findById(req.params.id, function(err, foundArena){
                    res.render("arenas/edit", {arena: foundArena});
    });
});

//UPATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkOwnership, function(req, res){
    //find and update correct campground
    Arena.findByIdAndUpdate(req.params.id, req.body.arena, function(err, updatedArena){
        if(err){
            // req.flash("error", "Campground not found");
            res.redirect("/arenas");
        } else {
            //redirect to show page
            res.redirect("/arenas/" + req.params.id);
        }
    });
});

//DESTROY ARENA ROUTE
router.delete("/:id", middleware.checkOwnership, function(req, res){
    Arena.findByIdAndRemove(req.params.id, function(err){
        if(err){
            // req.flash("error", "Campground not found");
            res.redirect("/arenas");
        } else {
            res.redirect("/arenas");
        }
    });
});

module.exports = router;