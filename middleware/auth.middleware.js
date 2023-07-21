const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");

//check le token de l'utilisateur a n'importe lieu de l'application
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                // res.cookie("jwt", "", {maxAge : 1});
                next();
            }else{
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

//pour se connecter automatiquement s'il a déjà été connecté auparavant
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
            if (err) {
                console.log(err);
            }else{
                console.log(decodedToken.id);
                next();
            }
        })
    }else{
        console.log("No Token");
    }
};