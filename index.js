// --- Imports par défaut et {nommé} 
import express, { json } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { sendMyMail } from './mail.js';
import { config } from 'dotenv';

// --- On crée le serveur http "express"
const app = express();
const port = 3000;

// --- Ajoute des configurations au serveur express
app.use(json());
app.use(cors());

// --- On se connecte à MySQL
const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    port: process.env.PORT,
    password: process.env.PASSWORD,
});

// Mes routes
app.get('/test', function (req, res)
{
    res.json({
      status : "ok"
    });
});

// --- Créer un utilisateur
app.post('/createClient', function(req, res)
{
  // --- On récupère les données sur le client envoyé dans le body en json
  let identifiant = req.body.identifiant;
  let fk_profil = req.body.fk_profil;
  let nom_compte = req.body.nom_compte;
  let mot_de_passe = req.body.mot_de_passe;
  let nom = req.body.nom;
  let prenom = req.body.prenom;
  let numero_telephone = req.body.numero_telephone;
  let mail = req.body.mail;
  let adresse = req.body.adresse;
  let ville = req.body.ville;
  let code_postal = req.body.code_postal;

  // --- Création de la requête sql
  connection.query('INSERT INTO comptes (fk_profil, nom_compte, mot_de_passe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal) VALUES (?,?,?,?,?,?,?,?,?,?)', 
  [fk_profil, nom_compte, mot_de_passe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal]);

  // --- Renvoie de la réponse
  res.json({
    status : "ok"
  });
});

app.post('/sendmail', function(req, res)
{
  let to = req.body.to;
  let subject = req.body.subject;
  let text = req.body.text;
  sendMyMail(to, subject, text);
});

// --- On dit au serveur d'écouter sur le port 3000
app.listen(port, () => {
  console.log('Server Ready');
});