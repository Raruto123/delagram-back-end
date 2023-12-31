const UserModel = require("../models/user.model");
const {signUpErrors, signInErrors} = require("../utils/errors.utils.js")
const jwt = require("jsonwebtoken");
// const TOKEN_SECRET = MAQ5XHB3oemwUpjpieVWFvEH0kKFYeBduE96t1I8xECWfJFS6z7mweYIo4fZaAAQ;
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, { expiresIn : maxAge
    } )
};

// const createToken = (_id) => {
//     return jwt.sign({_id : _id}, process.env.TOKEN_SECRET, { expiresIn : maxAge} )
// }

//inscription
module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body;

    try {
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user : user._id});
    }catch(err) {
        const errors = signUpErrors(err);
        res.status(200).json(({errors}))
    }
}

//connexion
module.exports.signIn = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwtoken", token, {httpOnly : true, maxAge : maxAge, sameSite : "none", secure : true})
        res.status(200).json({user : user._id})

    }catch(err){
        const errors = signInErrors(err);
        res.status(200).json({errors})
    }
}

//deconnection
module.exports.logout = (req, res) => {
    res.cookie("jwtoken", "", {maxAge : 1, httpOnly : true, sameSite : "none", secure : true});
    res.status(200).json({ message: "Déconnexion réussie" });
    // res.redirect("/");
}