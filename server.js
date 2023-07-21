const express = require("express");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({path : "config/.env"});
require("./config/database");
const {checkUser} = require("./middleware/auth.middleware.js");
const {requireAuth} = require("./middleware/auth.middleware.js");
const port = process.env.PORT || 3000;
const app = express();
const cors = require("cors");
// import fkill from "fkill";

// fkill(':5000');

//heroku choisis de lire Procfile et sinon le npm start de ton package.json
//heroku local pour tester en local avant de le push
    // "build": "cd client && npm run build",
    // "install-client": "cd client && npm install",
    // "heroku-postbuild": "npm run install-client && npm run build"

//middleware 
app.use(bodyParser.json());//pour lire les req.body
app.use(bodyParser.urlencoded({extended : true}));//req.params
app.use(cookieParser()); //req.cookies
const corsOptions = {
    origin : ["http://localhost:3001", "https://delagram-app-api.onrender.com"],
    credentials : true,
    "allowedHeaders" : ["sessionId", "Content-Type"],
    "exposedHeaders" : ["sessionId"],
    "methods" : "GET, HEAD, PUT, PATCH, POST, DELETE",
    "preflightContinue" : false
};
app.use(cors(corsOptions));


//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.send("API is running")
})

//routes 
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);


// if (process.env.NODE_ENV === "production") {
//     app.use(express.static('client/build'))
// }

// server
app.listen(port, () => {
    console.log(`serveur a commencé sur port : ${port}`);
})