
const express = require('express');  
const fs = require('fs');         
const path = require('path');       
const cors = require('cors');      

const port = 3000;  
const app = express();  // Création de l'application Express

// Configuration des middlewares
app.use(cors());           // Permet aux requêtes depuis d'autres domaines
app.use(express.json());   // Parse automatiquement les données JSON des requêtes

// Route GET pour la page d'accueil
app.get('/', (req, res) => {
    res.send('<h1>my first backend<h1>');  
});

// Route POST pour recevoir les donnees du formulaire de contact
app.post('/contact', (req, res) => {
    // recuPERATION DES CHAMPS DE FORMULAIRE
    const { nom, prenom, email, telephone, sujet, message } = req.body;
    
    // Vérification que les champs requis sont présents
    if (!nom || !prenom || !email || !telephone || !sujet || !
        message) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    //validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'format d\'email invalide'
        });   
    }
    //création de l'objet contact
    const contacts = {
        nom,
        prenom,
        email,
        telephone,
        sujet,
        message
    };
    
    //  Définition du chemin vers le fichier de base de données
    const dbPath = path.join(__dirname, 'db', 'data.json');
    let data = { contacts: [] }; // Initialisation des données

    // creation du dossier db s'il n'existe pas
    if (!fs.existsSync(path.join(__dirname, 'db'))) {
        fs.mkdirSync(path.join(__dirname, 'db'));
    }
    
    //  Lecture du fichier existant s'il existe
    try {
        if (fs.existsSync(dbPath)) {
            const file = fs.readFileSync(dbPath, 'utf8');
            data = file ? JSON.parse(file) : { contacts: [] };
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read database' });
    }
    
    //  Initialisation du tableau contct s'il n'existe pas
    if (!Array.isArray(data.contacts)) {
        data.contacts = [];
    }
    
    // Ajout au tableau
    data.contacts.push(contacts);
    
    // Sauvegarde dans le fichier JSON
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        // reponse de donnees sauvegardees
        res.status(200).json({
             status: 'ok',
            message: 'Contact saved successfully',
            contact: contacts
            });  

    } catch (err) {
        res.status(500).json({ error: 'Failed to save contact' });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})