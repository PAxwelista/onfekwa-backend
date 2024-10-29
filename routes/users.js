var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

//token
const uid2 = require('uid2');
const token = uid2(32);

//hachage mdp
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
	if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    const hash = bcrypt.hashSync(req.body.password, 10);

    if (data === null) {
      const newUser = new User({
        username: req.body.username,
        password: hash,
        token,
      });

      newUser.save().then(() => {
        res.json({ result: true, token });
        console.log(token)
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

// Route POST pour la connexion
router.post('/signin', async (req, res) => {
    const { email, password } = req.body; 

    // Vérifie que l'email et le mot de passe sont fournis
    if (!email || !password) return res.json({ message: 'Email et mot de passe requis.' });
    try {
        // Recherche de l'utilisateur dans la base de données avec l'email et le mot de passe
        const user = await user.findOne({ email, password }); 
        // Utilise la fonction `findOne` de Mongoose pour chercher un utilisateur avec cet email et ce mot de passe

        if (user) { // Si un utilisateur correspondant est trouvé
            // Génère un token JWT pour l'utilisateur
            const token = jwt.sign({ userId: user._id }, 'votre_secret', { expiresIn: '1h' });
            // `jwt.sign` crée un token avec l'ID de l'utilisateur ; 'votre_secret' est la clé secrète
            

            return res.json({ message: 'Connexion réussie', token }); 
        }
        
        res.json({ message: 'Identifiants incorrects.' }); // Si aucun utilisateur n'est trouvé, renvoie un message d'erreur
    } catch (error) {
        res.json({ message: 'Erreur interne' }); // En cas d'erreur, renvoie un message d'erreur générique
    }
});

// Route pour la connexion avec Google
router.post('/google-login', async (req, res) => {
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
module.exports = router;

