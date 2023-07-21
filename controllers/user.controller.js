const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

//afficher tous les utilisateurs
module.exports.getAllUsers = async(req, res) => {

    try{
        const users = await UserModel.find().select("-password");
        res.status(200).json({users : users});
    }catch(err) {
        res.status(200).json((err))
    }
}

//afficher les infos d'un utilisateur 
module.exports.getUser = async (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json("ID Inconnu : " + req.params.id);
    }
    try {
        const docs = await UserModel.findById(req.params.id).select("-password");
        res.json(docs);
    } catch (err) {
        console.log("ID inconnu : " + err);
    }
};

//s'il y a des paramètres dans le body des paramètres à écrire dans une balise input c'est req.body
//s'il y a des paramètres dans l'url c'est req.params


//modifier et mettre à jour un utilisateur
module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json("ID Inconnu : " + req.params.id);
    }

    try{
        const user = await UserModel.findOneAndUpdate({_id : req.params.id}, {$set : {bio : req.body.bio}}, {
            new : true, upsert : true, setDefaultsOnInsert : true
        }) 
        res.status(200).json(user);
    }catch (err) {
        res.status(500).json({message : err}) 
    }
}

//supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json("ID Inconnu : " + req.params.id);
    }

    try{
        const user = await UserModel.findOneAndDelete({_id : req.params.id});
        res.status(200).json(user);
    }catch{
        res.status(500).json({message : err}) 
    }
}

//follow quelqu'un 
module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send("ID Inconnu : " + req.params.id);
    }

    try{
        //ajouter à la liste de followers qui te suivent (followers)
        const followers = await UserModel.findByIdAndUpdate(req.params.id, {$addToSet : {following : req.body.idToFollow}},
            {new : true, upsert : true});
        res.status(200).send(followers);

        //ajouter à la liste de followers que tu suis (following)
        const followings = await UserModel.findByIdAndUpdate(req.body.idToFollow, {$addToSet : {followers : req.params.id}},
            {new : true, upsert : true});
        // res.status(200).send(followings);
    }catch(err) {
        res.status(500).send({message : err});
    }
}

//unfollow quelqu'un
module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)) {
        return res.status(400).send("ID Inconnu : " + req.params.id);
    }

    try{
        //supprimer de la liste de followers qui te suivent (followers)
        const unfollowers = await UserModel.findByIdAndUpdate(req.params.id, {$pull : {following : req.body.idToUnfollow}},
            {new : true, upsert : true});
        res.status(200).send(unfollowers);

        //supprimer de la liste de followers que tu suis (following)
        const unfollowings = await UserModel.findByIdAndUpdate(req.body.idToUnfollow, {$pull : {followers : req.params.id}},
            {new : true, upsert : true});
        // res.status(200).send(unfollowings);
    }catch(err) {
        res.status(500).send({message : err});
    }
}
