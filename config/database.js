const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(function() {
    console.log("Connecté à MongoDB")
}).catch(function(err) {
    console.log("Echec de connexion", err);
})