export default function (app, connection, authMiddleware) 
{
    app.patch('/updateClient', authMiddleware, function(req, res)
    {
        // --- On récupère les données sur le client envoyé dans le body en json
        let compteAModifier = req.body.compte_a_modifier.nom_compte;        

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
        connection.query("UPDATE comptes SET fk_profil=?, nom_compte=?, mot_de_passe=?, nom=?, prenom=?, numero_telephone=?, mail=?, adresse=?, ville=?, code_postal=? WHERE nom_compte=?", 
        [fk_profil, nom_compte, mot_de_passe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal, compteAModifier]);

        // --- Renvoie de la réponse
        res.json({
            status : "Compte mit à jour avec succès"
        });
    });
}