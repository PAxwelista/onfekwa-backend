var express = require("express");
var router = express.Router();

const { checkBody } = require("../modules/checkBody");

const Pusher = require("pusher");

const uid2 = require("uid2");

const Group = require("../models/groups");
const User = require("../models/users");
const Partner = require("../models/partners");

const pusherClient = new Pusher({ //récupère les configurations de Pusher
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true,
});


router.post("/:token/messages", (req, res) => {
  if (!checkBody(req.body, ["id","message"])) { 
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  
  User.findOne({ token: req.params.token }).then((dataUser) => {
    if (!dataUser) {
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
        $push: { //alimente la BDD 
          messages: {
            user: dataUser._id,
            text: req.body.message,
            date: new Date(),
            partner : req.body.partnerId 
          },
        },
      }
    ).then(()=>{
      Partner.findById(req.body.partnerId).then(dataPartner=>{
        // Utilise Pusher pour envoyer un message en temps réel sur un canal spécifique
        // Le canal est déterminé par l'ID (req.body.id) envoyé dans la requête
        pusherClient.trigger(req.body.id, "message", { 
          _id : uid2(12),
          // Ajoute les informations de l'utilisateur qui envoie le message
          user: dataUser,
          // Ajoute le texte du message envoyé dans le corps de la requête
          text: req.body.message,
          // Ajoute la date actuelle pour indiquer l'heure d'envoi du message
          date: new Date(),
          // Ajoute les informations du partenaire trouvé (dataPartner) pour inclure les détails du partenaire dans le message
          // Ceci est utile si un message inclut des informations spécifiques sur le partenaire (comme partnerId)
          partner : dataPartner //partnerId c'est si on envoi un partenaire par message
        });
        res.json({result : true})

      })
    })
    
  });
});

module.exports = router;
