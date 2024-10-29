const mongoose = require("mongoose");

const connexionString = process.env.CONNEXION_STRING;

mongoose.connect(connexionString,{connectTimeoutMS : 2000})
    .then(()=>console.log("connection established"))
    .catch(err=>console.error(err));