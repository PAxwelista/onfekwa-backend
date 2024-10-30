const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/:userId/favorites', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      return res.json({ message: "Utilisateur non trouvé." });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error(error);
    res.json({ message: 'Erreur lors de la récupération des favoris.' });
  }
});

router.post('/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  const { partnerId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ message: "Utilisateur non trouvé." });
    }

    if (user.favorites.includes(partnerId)) {
      return res.json({ message: "Ce partenaire est déjà dans vos favoris." });
    }

    user.favorites.push(partnerId);
    await user.save();

    res.json({ message: 'Favori ajouté avec succès.' });
  } catch (error) {
    console.error(error);
    res.json({ message: 'Erreur lors de l\'ajout du favori.' });
  }
});

router.delete('/:userId/favorites/:partnerId', async (req, res) => {
  const { userId, partnerId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ message: "Utilisateur non trouvé." });
    }

    if (!user.favorites.includes(partnerId)) {
      return res.json({ message: "Ce partenaire n'est pas dans vos favoris." });
    }

    user.favorites = user.favorites.filter(
      (favoriteId) => favoriteId.toString() !== partnerId
    );

    await user.save();

    res.json({ message: 'Favori supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.json({ message: 'Erreur lors de la suppression du favori.' });
  }
});

module.exports = router;















