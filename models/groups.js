const mongoose = require("mongoose"); // Importe mongoose pour gérer les schémas et les modèles dans MongoDB

// Schéma de l'utilisateur

const messagesSchema = mongoose.Schema({
  text: String,
  date: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  partner:{ type: mongoose.Schema.Types.ObjectId, ref: "partners" },
});

const groupsSchema = mongoose.Schema({
  name: String,
  messages: [messagesSchema],
});

Group = mongoose.model("groups", groupsSchema);

module.exports = Group;
