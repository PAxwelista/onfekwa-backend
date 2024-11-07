var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Group = require("../models/groups");

require("../models/connection");
const { checkBody } = require("../modules/checkBody");

//token
const uid2 = require("uid2");

//hachage mdp
const bcrypt = require("bcrypt");

const patternEmail = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

//Route pour l'inscription user par le formulaire
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password", "firstname", "lastname"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });

    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then((data) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const patternEmail =
      /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!patternEmail.test(req.body.email)) {
      return res.json({
        result: false,
        error: "Le format de l'email n'est pas valide",
      });
    }
    if (data === null) {
      const token = uid2(32);
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        token,
      });

      newUser.save().then(() => {
        res.json({
          result: true,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          token,
          email: req.body.email,
        });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "Cet email est déjà utilisé" });
    }
  });
});

// Route POST pour la connexion user via l'email
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      console.log(data.token);
      res.json({
        result: true,
        firstname: data.firstname,
        lastname: data.lastname,
        token: data.token,
        email: data.email,
      });
    } else {
      res.json({ result: false, error: "Aucun utilisateur trouvé" });
    }
  });
});

//route qui permet de récupérer les groupes à l'aide du token de l'utilisateur
router.get("/groups/:token", (req, res) => {
  const { token } = req.params;
  User.findOne({ token })
    .populate("groups")
    .then((data) => {
      if (!data) {
        return res.json({
          return: false,
          error: "user not find with this token",
        });
      }
      res.json({ result: true, groups: data.groups });
    });
});

//création d'une nouveau groupe et ajout dans le user
router.put("/createGroup/:token", (req, res) => {
  const { token } = req.params;
  if (!checkBody(req.body, ["name"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  User.findOne({ token }).then((data) => {
    if (data) {
      const newGroup = new Group({
        name: req.body.name,
      });
      newGroup.save();
      User.updateOne({ token }, { $push: { groups: newGroup } }).then((data) =>
        res.json({ result: true, group: newGroup })
      );
    }
  });
});

//route pour rejoindre un group via son email
router.put("/joinGroup", (req, res) => {
  if (!checkBody(req.body, ["email", "id"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  User.findOne({ email: { $regex: new RegExp(req.body.email, "i") }, groups: { $nin: req.body.id } }).then(
    
    (data) => {
      if (!data) {
        res.json({
          result: false,
          error: "Utilisateur dans le groupe ou inexistant",
        });
        return;
      }
      User.updateOne(
        { email: { $regex: new RegExp(req.body.email, "i") } },
        { $push: { groups: req.body.id } }
      ).then(() => res.json({ result: true }));
    }
  );
});

//route pour quitter un group
router.put("/exitGroup/:token", (req, res) => {
  const { token } = req.params;
  if (!checkBody(req.body, ["id"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  User.findOne({ token }).then((data) => {
    if (data) {
      User.updateOne({ token }, { $pull: { groups: req.body.id } }).then(
        (data) => {
          User.findOne({ groups: req.body.id }).then((data) => {
            if (data) {
              res.json({ result: true, info: "Groupe quitté" });
            } else {
              Group.deleteOne({ _id: req.body.id  }).then(() =>
                res.json({ result: true, info: "Groupe supprimé" })
              );
            }
          });
        }
      );
    }
  });
});

//route pour changer le mot de passe de l'utilisateur
router.put("/changePassword/:token", (req, res) => {
  const { token } = req.params;
  if (!checkBody(req.body, ["newPassword", "oldPassword"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }

  User.findOne({ token }).then((data) => {
    if (data && bcrypt.compareSync(req.body.oldPassword, data.password)) {
      const hash = bcrypt.hashSync(req.body.newPassword, 10);
      User.updateOne({ token }, { password: hash }).then((dataUpdate) =>
        res.json({ result: true })
      );
    } else {
      res.json({ result: false, error: "Ancien mot de passe incorrect" });
    }
  });
});

router.put("/groups/:token", (req, res) => {
  if (!checkBody(req.body, ["group"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  const { token } = req.params;
  const { groups } = req.body;
  User.updateOne({ token }, { groups }).then(() => res.json({ return: true }));
});

//route qui permet de supprimer un utilisateur via son email
router.delete("/", (req, res) => {
  if (!checkBody(req.body, ["email"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }

  User.findOne({ email: req.body.email }).then((dataUser) => {
    User.deleteOne({ email: req.body.email }).then((data) => {
      if (data.deletedCount <= 0) { // si on a rien supprimé
        res.json({result:false , error: "aucun élément supprimé"})
        return;
      }
      for (const dataGroup of dataUser.groups){ 
        // regarde tout les groupes de l'utilisateur supprimé
        User.find({ groups: dataGroup }).then((dateUserGroup) => {
          if (dateUserGroup.length<=0) { 
            // si personne ne fait parti des groupes on supprime les groupes
            Group.deleteOne({ _id: dataGroup  }).then();
          }
        })
      }
      res.json({result:true})
    })
  })
})

//route pour modifier le prénom d'un user
router.put("/changeFirstname/:token", (req, res) => {
  const { token } = req.params;
  if (!checkBody(req.body, ["newFirstname"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  User.updateOne({ token }, { firstname: req.body.newFirstname }).then(
    (dataUpdate) => res.json({ result: true })
  );
});

//route pour modifier le nom de famille d'un user
router.put("/changeLastname/:token", (req, res) => {
  const { token } = req.params;
  if (!checkBody(req.body, ["newLastname"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  User.updateOne({ token }, { lastname: req.body.newLastname }).then(
    (dataUpdate) => res.json({ result: true })
  );
});

//route pour modifier l'adresse email d'un user
router.put("/changeEmail/:token", (req, res) => {
  const { token } = req.params;
  if (!checkBody(req.body, ["newEmail"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }

  if (!patternEmail.test(req.body.newEmail)) {
    return res.json({
      result: false,
      error: "Le format de l'email n'est pas valide",
    });
  }

  User.findOne({ email: req.body.newEmail }).then((data) => {
    if (data) {
      res.json({ result: false, error: "email déjà utilisé" });
      return;
    }
    User.updateOne({ token }, { email: req.body.newEmail }).then((dataUpdate) =>
      res.json({ result: true })
    );
  });
});

//route qui permet d'afficher la liste des réservations d'un utilisateur
router.get("/reservations/:token", (req, res) => {
  const { token } = req.params;

  if (token) {
    User.findOne({ token })
      .populate("reservations.foreignKey")
      .then((data) => {
        console.log("data", data);

        if (data) {
          res.json({ result: true, reservations: data.reservations });
        } else {
          res.json({ result: false, error: "No user found" });
        }
      });
  }
});

// route qui permet de créer une réservation
router.put("/reservations/:token", (req, res) => {
  const { token } = req.params;
  if (!checkBody(req.body, ["partnerId", "date"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  const newReservation = {
    foreignKey: req.body.partnerId,
    date: req.body.date,
  };
  User.findOne({ token }).then((data) => {
    console.log("data", data);
    if (data) {
      data.reservations.push(newReservation); // Ajoute la réservation dans le tableau du sous document reservations
      data.save().then((updatedUser) => {
        res.json({ result: true, data: updatedUser.reservations });
      });
    } else {
      res.json({ result: false, error: "No user found" });
    }
  });
});

// route qui permet de supprimer une réservation

router.delete("/reservations/:token/:bookingId", (req, res) => {
  const { token, bookingId } = req.params;

  User.findOne({ token }).then((data) => {
    if (data) {
      data.reservations.pull(bookingId); // Retire la réservation du tableau par son id

      data.save().then((updatedUser) => {
        res.json({ result: true, data: updatedUser.reservations });
      });
    } else {
      res.json({ result: false, error: "No user found" });
    }
  });
});
module.exports = router;
