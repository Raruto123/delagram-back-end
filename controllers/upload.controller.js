const fs = require("fs");
const {promisify} = require("util");
const {uploadErrors} = require("../utils/errors.utils.js");
const pipeline = promisify(require("stream").pipeline);
const mime = require("mime-types");
const path = require("path");
const UserModel = require("../models/user.model.js");


// module.exports.uploadProfil = async (req, res) => {
//     try {
//       const mimeType = mime.lookup(req.file.originalname);
  
//       if (
//         mimeType !== "image/jpg" &&
//         mimeType !== "image/png" &&
//         mimeType !== "image/jpeg"
//       ) {
//         throw Error("fichier invalide");
//       }
  
//       if (req.file.size > 500000) {
//         throw Error("max size");
//       }
  
//       const fileName = req.body.name + ".jpg";
//       const filePath = path.join(
//         "./utilisateurs/uploads/profil",//test
//         fileName
//       );
  
//       if (req.file && req.file.path) {
//         const fileStream = fs.createReadStream(req.file.path);
//         const writeStream = fs.createWriteStream(filePath);
//         await pipeline(fileStream, writeStream);
//         console.log("Image téléchargée avec succès !");
//         // Supprimer le fichier temporaire après le téléchargement
//         fs.unlinkSync(req.file.path);
  
//         // Mise à jour de l'utilisateur avec la nouvelle image
//         const picture = await UserModel.findByIdAndUpdate(
//           req.body.userId,
//           {
//             $set: {
//               picture: "./uploads/profil/" + fileName,
//             },
//           },
//           {
//             new: true,
//             upsert: true,
//             setDefaultsOnInsert: true,
//           }
//         );
//         res.status(200).send(picture);
//       } else {
//         throw Error("Fichier introuvable");
//       }
//     } catch (err) {
//         const errors = uploadErrors(err);
//       console.error("Erreur lors du téléchargement de l'image :", err);
//       // return res.status(201).send({ message: errors });//dans la réponse de l'erreur ça va te donner response.data.message et ensuite ce que tu veux
//       return res.status(201).json({errors});
//     }
//   };
  
  module.exports.uploadProfil = async (req, res) => {

    try {
      const mimetype = mime.lookup(req.file.originalname)
      if (
        mimetype !== "image/jpg" &&
        mimetype !== "image/png" &&
        mimetype !== "image/jpeg"
      ) {
        throw Error("fichier invalide");
      }
  
      if (req.file.size > 500000) {
        throw Error("max size")
      }
  
      const picture = await UserModel.findByIdAndUpdate(
        req.body.userId,
        {
          $set: {
            picture: req.file.filename
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );
      res.status(200).send(picture);
    } catch (err) {
      const errors = uploadErrors(err);
      console.error("Erreur lors du téléchargement de l'image :", err);
      return res.status(201).json({ errors });
  
    }
  }
