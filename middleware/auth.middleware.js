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
                let user = await UserModel.findById(decodedToken._id);
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

// module.exports.requireAuth = (req, res, next) => {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
//             if (err) {
//                 console.log(err);
//                 res.send(200).json("no token")
//             }else{
//                 console.log(decodedToken.id);
//              // Appeler next() pour passer à la prochaine fonction middleware ou route
//                 next();
//         }})
//     }else{
//         console.log("No Token1");
//         // Gérer le cas où le token n'est pas présent dans les cookies de la requête
//         // Exemple : rediriger l'utilisateur vers une page d'erreur ou le déconnecter
//         // res.redirect("/error3");
//     }
// };


module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(401).json({ error: "Invalid or expired token" });
            }else {
                console.log(decodedToken._id);
                let user = await UserModel.findById(decodedToken._id);
                res.locals.user = user;
                // Le token est valide, vous pouvez accéder aux informations utilisateur si nécessaire
                // Exemple : res.locals.user = await UserModel.findById(decodedToken.id);
                next(); 
            }})
    } else {
        res.status(401).json({ error: "No token found" }); // Envoyer une réponse JSON avec le statut 401 pour indiquer qu'aucun token n'est présent dans les cookies de la requête
    }
};