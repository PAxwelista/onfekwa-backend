const express = require("express");
const router = express.Router();

const { checkBody } = require("../modules/checkBody");

const Group = require("../models/groups");

// Route pour récupérer les messages d'un groupe
router.post("/messages", (req, res) => {
  if (!checkBody(req.body, ["id"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  Group.findById(req.body.id)
    // `populate` est utilisé pour remplir les champs de référence dans les documents de la base de données.
    // Premier `populate` : Remplit le champ `messages` du groupe en récupérant tous les messages associés.
    // À l'intérieur du premier `populate`, un deuxième `populate` est utilisé pour remplir le champ `user` dans chaque message,
    // afin d'obtenir toutes les informations de l'utilisateur lié à chaque message.
    .populate({
      path: "messages",
      populate: {
        path: "user",
      },
      // Deuxième `populate` : Remplit à nouveau le champ `messages` pour obtenir cette fois-ci le champ `partner`
      // dans chaque message, afin d'inclure les informations du partenaire lié à chaque message.
    }).populate({
      path: "messages",
      populate: {
        path: "partner",
      },
    })
    .then((group) => {
      if (!group) {
        res.json({ result: false, error: "Pas de groupe avec cet ID" });
        return;
      }

      res.json({ result: true, messages: group.messages });
    });
});

router.put("/changeName/:newName", (req, res) => {
  if (!checkBody(req.body, ["id"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  Group.updateOne({ _id: req.body.id }, { name: req.params.newName }).then(() =>
    res.json({ result: true })
  );
});

module.exports = router;

