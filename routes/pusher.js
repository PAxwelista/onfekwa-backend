var express = require("express");
var router = express.Router();

const Pusher = require("pusher");

const uid2 = require("uid2");

const Group = require("../models/groups");
const User = require("../models/users");

const pusherClient = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true,
});

router.put("/:name", (req, res) => {
  console.log("User joined: " + req.params.name);
  pusherClient.trigger(req.body.chatChannel, "join", {
    name: req.params.name,
  });
  res.sendStatus(204);
});

router.delete("/:name", (req, res) => {
  console.log("User left: " + req.params.name);
  pusherClient.trigger(req.body.chatChannel, "part", {
    name: req.params.name,
  });
  res.sendStatus(204);
});

router.post("/:token/messages", (req, res) => {
  console.log(
    "User (token) " + req.params.token + " sent message: " + req.body.message
  );
  
  User.findOne({ token: req.params.token }).then((data) => {
    if (!data) {
      res.json({
        result: false,
        error: "Utilisateur avec ce token non trouvé",
      });
      return;
    }
    Group.updateOne(
      {
        _id: req.body.id,
      },
      {
        $push: {
          messages: {
            user: data._id,
            text: req.body.message,
            date: new Date(),
          },
        },
      }
    ).then(()=>{
      pusherClient.trigger(req.body.id, "message", {
        _id : uid2(12),
        user: data,
        text: req.body.message,
        date: new Date(),
      });
      res.json({result : true})
    })
    
  });
});

module.exports = router;
