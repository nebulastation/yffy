var middlewareObj = {};
var Arena = require("../models/arena");
var Comment = require("../models/comment");

middlewareObj.checkOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Arena.findById(req.params.id, function(err, foundArena){
                if(err){
                    // req.flash("error", "Campground not found");
                    res.redirect("/arenas");
                } else{
                        if(foundArena.author.id.equals(req.user._id)){
                            next();
                        } else {
                        // req.flash("error", "You can't do that");
                        res.redirect("back");
                        }
        } 
        }); 
    }   else {
            // req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    }

middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    // req.flash("error", "Comment not found");
                    res.redirect("/arenas");
                } else{
                        if(foundComment.author.id.equals(req.user._id)){
                            next();
                        } else {
                            // req.flash("error", "You can't do that");
                            res.redirect("back");
                        }
                    } 
            }); 
        }   else {
            // req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    }

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        // req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
}

module.exports = middlewareObj;