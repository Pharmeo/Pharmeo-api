import jsonwebtoken from 'jsonwebtoken';

export default function (app, connection, sendMyMail, authMiddleware) 
{
  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // --- Créer un utilisateur
  app.post('/createClient', function(req, res)
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

    // --- Création de la requête sql
    connection.query('INSERT INTO comptes (fk_profil, nom_compte, mot_de_passe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal) VALUES (?,?,?,?,?,?,?,?,?,?)', 
    [fk_profil, nom_compte, mot_de_passe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal]);

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
    let subject = req.body.subject;

    // TODO : Récupérer l'utilisateur via son identifiant (soit le mail)
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
    
    if (formPassword != bddPassword)
    {
      return res.status(404).json({
        message: 'Identifiant ou mot de passe incorrect'
      });
    }

    // --- Créer le token
    const token = await jsonwebtoken.sign(
      {
        //C'est l'objet qui contient les informations que l'on veut transmettre
        name
      },
      process.env.SECRET_KEY_TOKEN,
      {
        // C'est la clé qui permet de générer les tokens
          expiresIn: '24h'
      }
    );

    return res.json({
      token: token
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.post('/oublimdp', authMiddleware, async function(req,res) {
    let name = req.body.name;

    let mdp = await connection.query('SELECT mot_de_passe FROM comptes WHERE nom_compte=? ',[name])

    return res.json({
      mdp: mdp[0]
    });
  })
}


