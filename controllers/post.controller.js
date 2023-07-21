const PostModel = require("../models/post.model.js");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const mime = require("mime-types");
const fs = require("fs");
const {promisify} = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = require("path");
const {uploadErrors} = require("../utils/errors.utils.js");


// Fonction pour vérifier l'unicité du pseudo avant l'insertion
const checkUniquePseudo = async (pseudo) => {
    try {
      const existingUser = await UserModel.findOne({ pseudo: pseudo });
      return existingUser ? false : true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

module.exports.createPost = async (req, res) => {
    const fileName = req.body.posterId + Date.now() + ".jpg";

    try {
        const mimeType = mime.lookup(req.file.originalname);
    
        if (
          mimeType !== "image/jpg" &&
          mimeType !== "image/png" &&
          mimeType !== "image/jpeg"
        ) {
          throw Error("fichier invalide");
        }
    
        if (req.file.size > 500000) {
          throw Error("max size");
        }
    
        const filePath = path.join(
          __dirname,
          "../client/public/uploads/posts/",
          fileName
        );
    
        if (req.file && req.file.path) {
          const fileStream = fs.createReadStream(req.file.path);
          const writeStream = fs.createWriteStream(filePath);
          await pipeline(fileStream, writeStream);
          console.log("Image téléchargée avec succès !");
          // Supprimer le fichier temporaire après le téléchargement
          fs.unlinkSync(req.file.path);
    
          // Mise à jour de l'utilisateur avec la nouvelle image
        } else {
          throw Error("Fichier introuvable");
        }
      } catch (err) {
        const errors = uploadErrors(err);
        console.error("Erreur lors du téléchargement de l'image :", err);
        return res.status(201).json({errors});//La principale différence réside dans le format de la réponse renvoyée par le serveur.

        // //Lorsque vous utilisez res.status(201).json({errors}), vous renvoyez une réponse au format JSON. 
        // La méthode json() de l'objet response de Express est utilisée pour convertir l'objet JavaScript en JSON et 
        // renvoyer cette réponse au client. Cela est généralement utilisé lorsque vous souhaitez renvoyer des données 
        // structurées au format JSON.
      }


    const newPost = new PostModel({
    posterId : req.body.posterId,
    message : req.body.message,
    picture : req.file != null ? "./uploads/posts/" + fileName : "",
    video : req.body.video,
    likers : [],
    comments : []
    })
    // const {posterId, message, video, likers, comments} = req.body;//destructuring tu aurais pu separer en faisant const = newPost = new postModel.({posterId : req.body.posterId}, ..., likers : [])
    // const picture = req.file;
    try {
        const post = await newPost.save();
        res.status(201).json({post : post});
    }catch(err) {
        res.status(400).send(err);
    }
};

module.exports.readPost = async(req, res) => {
    
    try{
        const post = await PostModel.find().sort({createdAt : -1});
        res.status(201).json(post);
    }catch(err){
        res.send(err);

    }
};

module.exports.updatePost = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json("ID Inconnu : " + req.params.id);
    }

    try{
        const post = await PostModel.findByIdAndUpdate({_id : req.params.id}, {$set : {message : req.body.message}}, {
            new : true, upsert : true, setDefaultsOnInsert : true
        }) 
        res.status(200).json(post);
    }catch (err) {
        res.status(500).json({message : err}) 
    }
};

module.exports.deletePost = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json("ID Inconnu : " + req.params.id);
    }

    try{
        const post = await PostModel.findByIdAndDelete({_id : req.params.id});
        res.status(200).json(post);
    }catch{
        res.status(500).json({message : err}) 
    }
};

// module.exports.likePost = async (req, res) => {
//     if (!ObjectID.isValid(req.params.id)) {
//       return res.status(400).send("ID Inconnu : " + req.params.id);
//     }
  
//     try {
//         const updatedPost = await PostModel.findByIdAndUpdate(
//             req.params.id,
//             { $addToSet: { likers: req.body.idToLike } },
//             { new: true }
//           );
  
//       // Vérifier si le post a été trouvé
//       if (!updatedPost) {
//         return res.status(404).send("Post non trouvé");
//       }
  
//       // Vérifier si l'utilisateur a déjà aimé le post
//       if (updatedPost.likers.includes(req.body.idToLike)) {
//         return res.status(400).send("Vous avez déjà aimé ce post.");
//       }
  
//       res.status(200).send(likers);
//     } catch (err) {
//       res.status(500).send({ message: err });
//     }
//   };
// module.exports.likePost = async (req, res) => {
//     if (!ObjectID.isValid(req.params.id)) {
//       return res.status(400).send("ID Inconnu : " + req.params.id);
//     }
  
//     try {
//       if (req.body.idToLike && req.body.pseudo) {
//         const updatedPost = await PostModel.findByIdAndUpdate(
//           req.params.id,
//           { $addToSet: { likers: req.body.idToLike } },
//           { new: true, upsert: true }
//         );
  
//         const likers = await UserModel.findByIdAndUpdate(
//           req.body.idToLike,
//           { $addToSet: { likes: req.params.id } },
//           { new: true, upsert: true }
//         );
  
//         res.status(200).send({ likes: updatedPost.likers, likers });
//       } else {
//         res.status(400).send("Données requises manquantes");
//       }
//     } catch (err) {
//       res.status(500).send({ message: err });
//     }
//   };
  

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID Inconnu : " + req.params.id);
    }

    try {


        // Ajouter à la liste de likes qui augmentent
        const likes = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { likers: req.body.idToLike } },
            { new: true, upsert: true }
        );

        // Ajouter à la liste de likers qui augmentent
        const likers = await UserModel.findByIdAndUpdate(
            req.body.idToLike,
            { $addToSet: { likes: req.params.id } },
            { new: true, upsert: true }
        );

        res.status(200).send({ likes, likers });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};



module.exports.unlikePost = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID Inconnu : " + req.params.id);
    }

    try{
        //supprimer de la liste de likes qui diminuent
        const unlikes = await PostModel.findByIdAndUpdate(req.params.id, {$pull : {likers : req.body.idToUnlike}},
            {new : true, upsert : true});

        //supprimer de la liste de likers qui diminuent
        const unlikers = await UserModel.findByIdAndUpdate(req.body.idToUnlike, {$pull : {likes : req.params.id}},
            {new : true, upsert : true});
        // res.status(200).send(unlikers);
        res.status(200).send({unlikes, unlikers});
    }catch(err) {
        res.status(500).send({message : err});
    }
}

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID Inconnu1 : " + req.params.id);
    }


    try {
        const post_commented = await PostModel.findByIdAndUpdate(req.params.id, {
            $push: {
                comments: {
                    commenterId: req.body.commenterId,
                    commenterPseudo: req.body.commenterPseudo,
                    text: req.body.text,
                    timestamp: new Date().getTime()
                }
            }
        }, { new: true, upsert: true });
        res.status(200).send(post_commented);
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

// module.exports.editCommentPost = async(req, res) => {
//     if (!ObjectID.isValid(req.params.id)) {
//         return res.status(400).send("ID Inconnu : " + req.params.id);
//     }

//     try{
//         const post_edited = await PostModel.findById(req.params.id).then(function(docs) {
//             const theComment = docs.comments.find((comment)).then(function() {
//                 comment._id.equals(req.body.commentId);
//             })

//             if (!theComment) {
//                 return res.status(404).send("Commentaire non trouvé");
//             }
//             theComment.text = req.body.text;


//             return post_edited.save().then(function(err) {
//                 if (!err) {
//                     return res.status(200).send(post_edited);
//                 }
//                 return res.status(500).send(err);
//             });
//         });
//     }catch(err){
//         res.status(400).send({ message: err });
//     }

// };

// module.exports.editCommentPost = async (req, res) => {
//     if (!ObjectID.isValid(req.params.id)) {
//         return res.status(400).send("ID Inconnu : " + req.params.id);
//     }

//     try {
//         const post_edited = await PostModel.findById(req.params.id);
//         const theComment = post_edited.comments.find((comment) => comment._id.equals(req.body.commentId));

//         if (!theComment) {
//             return res.status(404).send("Commentaire non trouvé");
//         }
//             theComment.text = req.body.text;


//         return post_edited.save().then(function (err) {
//             if (!err) {
//                 return res.status(200).send(post_edited);
//             }
//             return (
//                 res.status(500).send(err),
//                 console.log(err)
//                 );
//         });
//     } catch (err) {
//         res.status(400).send({ message: err });
//     }
// };

module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID Inconnu : " + req.params.id);
    }
  
    try {
      const post_edited = await PostModel.findById(req.params.id);
      const theComment = post_edited.comments.find((comment) => comment._id.equals(req.body.commentId));
  
      if (!theComment) {
        return res.status(404).send("Commentaire non trouvé");
      }
  
      theComment.text = req.body.text;
  
      return post_edited.save().then(function (savedPost) {
        return res.status(200).send(savedPost);
      }).catch(function (err) {
        console.error(err); // Affiche l'erreur réelle dans la console du serveur
        return res.status(500).send("Erreur interne du serveur");
      });
    } catch (err) {
      console.error(err); // Affiche l'erreur réelle dans la console du serveur
      return res.status(400).send({ message: err });
    }
  };
  


module.exports.deleteCommentPost = async(req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID Inconnu : " + req.params.id);
    }

    try{
        const post_deleted = await PostModel.findByIdAndUpdate(req.params.id, 
            {
                $pull : {
                    comments : {
                        _id : req.body.commentId
                    }
                }
            },{new : true, upsert : true, setDefaultsOnInsert : true});
            res.status(200).send(post_deleted);
    }catch(err){
        return res.status(400).send(err);
    }
};