export default function (app, connection, authMiddleware) 
{
  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.delete('/favoris/delete/:idCompte/:idMedicament', authMiddleware, async function(req,res) 
  {
    let idCompte = req.params.idCompte;
    let idMedicament = req.params.idMedicament;

    console.log(idCompte);
    console.log(idMedicament);
    
    

    connection.query('DELETE FROM favoris WHERE id_compte = ? AND id_medicament = ?',[idCompte, idMedicament])

    // --- La réponse à la requête
    res.json({
      status : "ok"
    });
  })
}