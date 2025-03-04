export default function (app, connection, authMiddleware) 
{
  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.delete('/favoris/delete/:idCompte/:idMedicament', authMiddleware, async function(req,res) 
  {
    let idCompte = req.params.idCompte;
    let idMedicament = req.params.idMedicament;

    connection.query('DELETE FROM favoris WHERE id_compte = ? AND id_medicament = ?',[idCompte, idMedicament])

    // --- La réponse à la requête
    res.json({
      status : "ok"
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // TODO : Faire la route pour supprimer un médicament
  app.delete('/medicament/:idMedicament', authMiddleware, async function(req,res) 
  {
    let idCompte = req.params.idMedicament;

    connection.query('DELETE FROM medicaments WHERE identifiant = ?',[idCompte])

    // --- La réponse à la requête
    res.json({
      status : "ok"
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // TODO : Faire une route pour supprimer un compte (un pharmacien)
  app.delete('/compte/:idCompte', authMiddleware, async function(req,res) 
  {
    let idCompte = req.params.idCompte;

    connection.query('DELETE FROM comptes WHERE identifiant = ?',[idCompte])

    // --- La réponse à la requête
    res.json({
      status : "ok"
    });
  })
}