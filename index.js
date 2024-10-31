// --- Imports par défaut et {nommé} 
import express, { json } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { sendMyMail } from './mail.js';

// --- On crée le serveur http "express"
const app = express();
const port = 3000;

// --- Ajoute des configurations au serveur express
app.use(json());
app.use(cors());

// --- On se connecte à MySQL
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'pharmeo',
    port: '3306',
    password: 'Kyo100705tete*',
});

// Mes routes
app.get('/test', function (req, res)
{
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