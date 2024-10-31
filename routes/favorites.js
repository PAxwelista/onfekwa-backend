const express = require('express');
const User = require('../models/users'); 
const router = express.Router();

// Route pour récupérer les favoris d'un utilisateur
router.get('/:userId', (req, res) => {
    User.findById(req.params.userId) // Cherche l'utilisateur par son ID
        .then(user => res.json(user ? user.favorites : [])); // Renvoie les favoris ou un tableau vide
}); 

module.exports = router;













// Route pour ajouter un favori
// router.post('/:userId/favorites', (req, res) => {
//   User.findById(req.params.userId).then(user => {
//       user.favorites.push(req.body.favorite); // Ajout du favori
//       return user.save(); // Sauvegarde
//   }).then(updatedUser => {
//       res.json(updatedUser.favorites); // Renvoie la liste des favoris
//   });
// })

// // Route pour supprimer un favori
// router.delete('/:userId/favorites/:favoriteId', (req, res) => {
//   const { userId, favoriteId } = req.params;

//   User.findById(userId).then(user => {
//       user.favorites = user.favorites.filter(favorite => favorite !== favoriteId); // Suppression du favori
//       return user.save();
//   }).then(updatedUser => {
//       res.json({ favorites: updatedUser.favorites });
//   });
// });



