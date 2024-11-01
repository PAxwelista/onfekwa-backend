var express = require('express');
var router = express.Router();
const User = require('../models/users');

require('../models/connection');
const { checkBody } = require('../modules/checkBody');

//token
const uid2 = require('uid2');
const token = uid2(32);

//hachage mdp
const bcrypt = require('bcrypt');

//Route pour l'inscription user par le formulaire
router.post('/signup', (req, res) => {
	if (!checkBody(req.body, ['email', 'password', 'firstname', 'lastname'])) {
    res.json({ result: false, error: 'Champs manquants à remplir' });
    
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const patternEmail = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!patternEmail.test(req.body.email)){
      return res.json({ result: false, error: "Le format de l'email n'est pas valide" })
    }
    if (data === null) {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        groups: ['En couple', 'Avec les collègues', 'Avec les amis', 'En famille'],
        token,
      });

      newUser.save().then(() => {
        res.json({ result: true, firstname: req.body.firstname, token, email: req.body.email });
        console.log(token)
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'Cet email est déjà utilisé' });
    }
  });
});
//Route POST pour l'inscription user via google
router.post('/google', (req, res) => {
  // Check if the user has not already been registered
  User.findOne({ email: req.body.username }).then(data => {
    const hash = bcrypt.hashSync(req.body.password, 10);

    if (data === null) {
      const newUser = new User({
        firstname: req.body.fisrtname,
        lastname: req.body.lastname,
        groups: ['En couple', 'Avec les collègues', 'Avec les amis', 'En famille'],
        token,
      });

      newUser.save().then(() => {
        res.json({ result: true, firstname: data.firstname, token });
        console.log(token)
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'Cet email est déjà utilisé' });
    }
  });
});

// Route POST pour la connexion user via l'email
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Champs manquants à remplir' });
    return;
  }

  User.findOne({ email: req.body.email}).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      console.log(data.token)
      res.json({ result: true, firstname: data.firstname, token: data.token, email: data.email });
    } else {
      res.json({ result: false, error: 'Aucun utilisateur trouvé' });
    }
  });
});

// Route pour la connexion avec Google
router.post('/google', async (req, res) => {
    const { idToken } = req.body; // Le token reçu du client

    try {
        // Vérifier le token Google
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID, // ID client Google
        });
        const payload = ticket.getPayload(); // Récupérer les informations de l'utilisateur

        // Vérifier si l'utilisateur existe déjà dans la base de données
        let user = await findOne({ googleId: payload.sub });
        if (!user) {
            // Créer un nouvel utilisateur si non existant
            user = new user({
                email: payload.email,
                googleId: payload.sub,
                name: payload.name,
            });
            await user.save(); // Sauvegarder le nouvel utilisateur
        }

        // Gérer la session ou générer un token (JWT, par exemple)
        const token = user.generateAuthToken(); // Méthode pour générer un token
        res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
    }
});

//route qui permet de récupérer les groupes à l'aide du token de l'utilisateur
router.get("/groups/:token", (req, res) => {
    const {token} = req.params;
    User.findOne({token})
        .then(data=>{
            if (!data){
                return res.json({return : false , error : "user not find with this token"})
            }
            res.json({return : true , groups : data.groups})
        })

})

router.put("/groups/:token" , (req,res)=>{
    const {token} = req.params;
    const {groups} = req.body;
    User.updateOne({token},{groups}).then(()=>res.json({return : true}))
})

//route qui permet de supprimer un utilisateur via son email
router.delete('/', (req,res) => {
  
  User.deleteOne({email: req.body.email})
  .then(data =>{
    console.log(data)
      if(data.deletedCount > 0){
          res.json({result: true})
      } else {
          res.json({result: false, error: 'No user found'})
      }
  }
     
  )
})
module.exports = router;

