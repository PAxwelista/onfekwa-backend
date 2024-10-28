import { Router } from 'express';
const router = Router();
import User, { findOne } from '../models/User'; 
import { OAuth2Client } from 'google-auth-library'; // Pour la connexion Google

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

// Route pour la connexion d'un utilisateur avec email et mot de passe
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await findOne({ email });
        if (!user || !(await user.verifyPassword(password))) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }
        
        // Gérer la session ou générer un token 
        const token = user.generateAuthToken(); // Méthode pour générer un token
        res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
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
            user = new User({
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

export default router;

