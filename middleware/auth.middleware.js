const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");

//check le token de l'utilisateur a n'importe lieu de l'application
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwtoken;
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
    const token = req.cookies.jwtoken;
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

// module.exports.requireAuth = async (req, res, next) => {

//     try {
//                 //get jwt token from cookies

//         const token = req.cookies.jwtoken;

//                 //verifying token with TOKEN_SECRET

//         const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET);


//         const user = await UserModel.findOne({ _id : verifyToken._id, "authTokens.authToken" : token });


//         if (!user) {
//             throw new Error("utilisateur pas trouvé")
//         }

//         // get user's all data in user
//         req.user = user;
        
//         next();
//     } catch (error) {
//         res.status(401).send({error : "pas de pièce trouvée"});
//     }
// }