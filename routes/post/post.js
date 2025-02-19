import jsonwebtoken from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../../passwordUtils.js';

export default function (app, connection, sendMyMail, authMiddleware) 
{
  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // --- Permet de créer un utilisateur
  app.post('/createClient', async function(req, res)
  {
    // --- On récupère les données sur le client envoyé dans le body en json
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

    let motDePasseHashe = await hashPassword(mot_de_passe);
    console.log(motDePasseHashe);

    // --- Création de la requête sql
    await connection.query('INSERT INTO comptes (fk_profil, nom_compte, mot_de_passe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal) VALUES (?,?,?,?,?,?,?,?,?,?)', 
    [fk_profil, nom_compte, motDePasseHashe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal]);

    // --- Renvoie de la réponse
    res.json({
      status : "ok"
    });
  });

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.post('/sendmail', async function(req, res)
  {
    let to = req.body.to;

    const [user] = await connection.query('SELECT * FROM comptes WHERE nom_compte=? ',[to]);

    if (user.length === 0) {
      return res.status(404).json({
          message: "Utilisateur non trouvé"
      });
    }
    
    let firstname = user[0].prenom;
    let password = user[0].mot_de_passe;
    
    sendMyMail(to, firstname, password);

    return res.status(200).json({
      message: "Email envoyé avec succès"
    })
  });

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.post('/compte', authMiddleware, async function(req, res) {

    const name = req.body.name;
    const [compte] = await connection.query('SELECT * FROM comptes WHERE nom_compte=? ',[name]);

    return res.json({
      compte: compte[0]
    });
  });

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.post('/login', async function(req,res) 
  {
    let name = req.body.name;
    let [compte] = await connection.query('SELECT * FROM comptes WHERE nom_compte=? ',[name])

    if (compte.length == 0) {
      return res.status(404).json({
        message: 'Identifiant ou mot de passe incorrect'
      });
    }

    let bddPassword = compte[0].mot_de_passe;
    let formPassword = req.body.password;

    // --- Hashage et vérification du mot de passe
    let motDePasseHashe = await hashPassword(formPassword, (err, hashedPassword) => {
      if (err) 
      {
          console.error('Erreur lors du hachage du mot de passe:', err);
          return;
      }
    });
    let isMatch = verifyPassword(bddPassword, motDePasseHashe, (err, isMatch) => {
      if (err) {
          console.error('Erreur lors de la vérification du mot de passe:', err);
          return;
      }
      console.log('Le mot de passe correspond-il ?', isMatch);
    });
    if (!isMatch)
    {
      return res.status(404).json({
        message: 'Identifiant ou mot de passe incorrect'
      });
    }

    // ---  Création du token
    const token = await jsonwebtoken.sign(
      {
        //C'est l'objet qui contient les informations que l'on veut transmettre
        name
      },
      process.env.SECRET_KEY_TOKEN,
      {
          // Clé permettant de générer les tokens
          expiresIn: '24h'
      }
    );

    return res.json({
      token: token
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.post('/oublimdp', authMiddleware, async function(req,res) 
  {
    let name = req.body.name;

    let mdp = await connection.query('SELECT mot_de_passe FROM comptes WHERE nom_compte=? ',[name])

    return res.json({
      mdp: mdp[0]
    });
  })

  app.post('/addfavoris', authMiddleware, async function(req, res) {
    let idMedicament = req.body.idMedicament;
    let idCompte = req.body.idCompte;

    // --- On récupère les favoris de l'utilisateur
    let [favoris] = await connection.query('SELECT * FROM favoris WHERE id_compte = ?', [idCompte]);

    // --- On teste si le favoris à ajouter existe déjà
    let existeDeja = favoris.some(favori => favoris.id_medicament === idMedicament);

    if (existeDeja) {
        // --- Si le favoris existe déjà, on renvoie une réponse appropriée
        return res.status(400).json({
            status: "error",
            message: "Ce médicament est déjà dans vos favoris."
        });
    }

    // --- S'il n'existe pas, on fait la requête suivante
    await connection.query('INSERT INTO favoris (id_medicament, id_compte) VALUES (?, ?)', [idMedicament, idCompte]);

    // --- La réponse à la requête
    res.json({
        status: "ok",
        message: "Médicament ajouté aux favoris avec succès."
    });
  });

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.post('/id', authMiddleware, async function(req,res) 
  {
    let nom_compte = req.body.nom_compte;
    let [compte] = await connection.query('SELECT * FROM comptes WHERE nom_compte = ?',[nom_compte])
    let idCompte = compte[0].identifiant;    
    
    res.json({
      id_compte : idCompte
    });
  })
}