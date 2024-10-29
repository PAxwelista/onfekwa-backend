const mongoose = require('mongoose'); // Importe mongoose pour gérer les schémas et les modèles dans MongoDB

// Schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true } 
});

module.exports = mongoose.model('User', userSchema); 


