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
                // next();
            }
            next();
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
                // Gérer le cas où le token est invalide ou expiré
                // Exemple : rediriger l'utilisateur vers une page d'erreur ou le déconnecter
                res.redirect("/error1");
            }else{
                console.log(decodedToken.id);
                 // Définir l'utilisateur authentifié dans res.locals.user
                 let user = await UserModel.findById(decodedToken.id);
                 if (user) {
                    res.locals.user = user;
                 } else {
                    // Gérer le cas où l'utilisateur associé au token n'existe pas
                    // Exemple : rediriger l'utilisateur vers une page d'erreur ou le déconnecter
                    res.redirect("/error2");
                 }
            }
             // Appeler next() pour passer à la prochaine fonction middleware ou route
            next();
        })
    }else{
        console.log("No Token1");
        // Gérer le cas où le token n'est pas présent dans les cookies de la requête
        // Exemple : rediriger l'utilisateur vers une page d'erreur ou le déconnecter
        res.redirect("/error3");
    }
};