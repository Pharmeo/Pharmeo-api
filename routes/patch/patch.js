export default function (app, connection, authMiddleware) 
{
    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------
    // --- Permet de modifier un utilisateur via son nom de compte
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
        connection.query("UPDATE comptes SET nom_compte=?, mot_de_passe=?, nom=?, prenom=?, numero_telephone=?, mail=?, adresse=?, ville=?, code_postal=? WHERE nom_compte=?", 
        [nom_compte, mot_de_passe, nom, prenom, numero_telephone, mail, adresse, ville, code_postal, compteAModifier]);

        // --- Renvoie de la réponse
        res.json({
            status : "Compte mit à jour avec succès"
        });
    });

    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------
    // --- Permet de modifier un utilisateur via son nom de compte
    app.patch('/updateMedicament/:idMedicament/:idPharmacie', authMiddleware, function(req, res)
    {
        let idMedicament = req.params.idMedicament;
        let idPharmacie = req.params.idPharmacie;

        // --- On récupère les données sur le medicament envoyé dans le body en json
        let nom  = req.body.nom;
        let zone_action = req.body.zone_action;
        let effets_secondaires = req.body.effets_secondaires;
        let composition = req.body.composition;
        let description = req.body.description;
        // ---
        let quantite = req.body.quantite;

        // --- Requête SQL de mise à jour avec INNER JOIN
        let sql = `
        UPDATE medicaments
        INNER JOIN relations_pharmacies_medicaments
        ON medicaments.identifiant = relations_pharmacies_medicaments.identifiant_medicament
        SET
        medicaments.nom = ?,
        medicaments.zone_action = ?,
        medicaments.effets_secondaires = ?,
        medicaments.composition = ?,
        medicaments.description = ?,
        relations_pharmacies_medicaments.quantite = ?
        WHERE
        medicaments.identifiant = ? AND relations_pharmacies_medicaments.identifiant_pharmacie = ?`;

        // --- Création de la requête sql
        connection.query(sql, 
            [nom, zone_action, effets_secondaires, composition, description, quantite, idMedicament, idPharmacie]);

        // --- Renvoie de la réponse
        res.json({
            status : "Médicament mit à jour avec succès"
        });
    });
}