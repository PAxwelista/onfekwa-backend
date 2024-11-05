const express = require("express");
const router = express.Router();

const Group = require("../models/groups");

// Route pour récupérer les messages d'un groupe
router.post("/messages", (req, res) => {
  Group.findById(req.body.id)
    .populate({
      path: "messages",
      populate: {
        path: "user",
      },
    })

    .then((group) => {
      console.log(group);
      if (!group) {
        res.json({ result: false, error: "Pas de groupe avec cet ID" });
        return;
      }

      res.json({ result: true, messages: group.messages });
    });
});

module.exports = router;
