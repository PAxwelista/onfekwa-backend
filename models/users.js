const mongoose = require('mongoose'); // Importe mongoose pour gérer les schémas et les modèles dans MongoDB

require('../models/partners')
// Schéma de l'utilisateur


const bookingsSchema = mongoose.Schema({
    foreignKey: { type: mongoose.Schema.Types.ObjectId, ref: 'partners' },
    date: Date,
    group: String
   });

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String, 
    password:String,
    phoneNumber: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'partners' }],
    groups: [String],
    reservations: [bookingsSchema],
    token: String, 
});

User = mongoose.model('users', userSchema); 

module.exports = User;


