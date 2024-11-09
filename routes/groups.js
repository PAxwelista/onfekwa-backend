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
    .populate({
      path: "messages",
      populate: {
        path: "user",
      },
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

