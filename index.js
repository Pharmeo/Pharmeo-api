// --- Imports par défaut et {nommé} 
import express, { json } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { sendMyMail } from './mail.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

//-----------------------------------------------------------------------------
//----------------------------------------------------------------------------- 
// --- On crée le serveur http "express"
const app = express();
const port = 3000;

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// --- Ajoute des configurations au serveur express
app.use(json());
app.use(cors());

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// --- On se connecte à MySQL
const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    port: process.env.PORT,
    password: process.env.PASSWORD
});

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// --- On vérifie le token
const authMiddleware = async (req, res, next) => {
  try {
      const decodedToken = await jsonwebtoken.verify(
          req.headers.authorization, 
          process.env.SECRET_KEY_TOKEN
      );

      next();
  } catch (error) {
      return res.status(403).json({
          message: "Vous n'avez pas l'autorisation"
      });
  }
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// --- On récupère toutes les routes nécéssaires au fonctionnement de l'API
// TODO : Il y a une erreur dans la manière d'importer
import routesPost from './routes/post/post.js';
import routesGet from './routes/get/get.js';
import routesDelete from './routes/delete/delete.js';
//import routes from './routes.js';
// ---
routesPost(app, connection, sendMyMail, authMiddleware);
routesGet(app, connection, authMiddleware);
routesDelete(app, connection, authMiddleware);
//routes(app, connection);

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// --- On dit au serveur d'écouter sur le port 3000
app.listen(port, () => {
  console.log('Server Ready');
});