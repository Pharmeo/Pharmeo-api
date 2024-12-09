export default function (app, connection, sendMyMail) 
{
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

  app.post('/sendmail', function(req, res)
  {
    let to = req.body.to;
    let subject = req.body.subject;
    let text = req.body.text;
    sendMyMail(to, subject, text);
  });

  app.post('/compte', async function(req,res) {
    let name = req.body.name;

    let compte = await connection.query('SELECT * FROM comptes WHERE nom_compte=? ',[name])

    return res.json({
      compte: compte[0]
    });
  })

  app.post('/oublimdp', async function(req,res) {
    let name = req.body.name;

    let mdp = await connection.query('SELECT mot_de_passe FROM comptes WHERE nom_compte=? ',[name])

    return res.json({
      mdp: mdp[0]
    });
  })
}


