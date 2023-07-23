const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60 * 1000;


const userSchema = new moongose.Schema({
    pseudo: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 55,
        unique: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        trim: true
    },
    picture : {
        type : String,
        default : "./uploads/profil/random-user.png"
    },  
    password: {
        type: String,
        required: true,
        max: 1024,
        minlength: 6
    },
    bio: {
        type: String,
        max: 1024
    },
    followers: {
        type: [String],
    },
    following: {
        type: [String]
    },
    likes: {
        type: [String]
    },
    authTokens : [{
        authToken : {
            type : String,
            require : true
        }
    }]
},
    {
        timestamps: true
    }
);


//joue la fonction avant d'enregistrer le document dans la databse pour crypter le password
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//pour decrypter le mot de passe lorsqu'il se connecte et pour qu'il reconnaisse
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

userSchema.methods.generateAuthTokenAndSaveUser = async function() {
    const authToken = jwt.sign({_id : this._id.toString()}, process.env.TOKEN_SECRET, {expiresIn : maxAge});
    this.authTokens.push({authToken});
    await this.save();
    return authToken;
}


module.exports = mongoose.model("User", userSchema)