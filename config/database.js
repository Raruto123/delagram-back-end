// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser : true,
//     useUnifiedTopology : true,
// }).then(function() {
//     console.log("Connecté à MongoDB")
// }).catch(function(err) {
//     console.log("Echec de connexion", err);
// })

//test = 

// database.js

const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const path = require("path");
const fs = require("fs");
const { pipeline } = require("stream");

mongoose.connect("mongodb+srv://proplayer54:raruto123@cluster0.lvmwmio.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(function () {
  console.log("Connecté à MongoDB");
  // Initialisation de GridFS
  const conn = mongoose.connection;
  let gfs;
  conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads"); // Nom de la collection où seront stockés les fichiers
  });
}).catch(function (err) {
  console.log("Echec de connexion", err);
});

module.exports = mongoose;
