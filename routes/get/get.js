export default function (app, connection) 
{
  app.get('/test', function (req, res)
  {
      return res.json({
        status : "ok tout fonctionne"
      });
  });

  // --- Permet de récupérer tous les médicaments
  app.get('/medicaments', async function (req, res)
  {
   const medicaments = await connection.query('SELECT * FROM medicaments');

    // --- On renvoie un tableau de json
    return res.json({
      medicaments
    });
  });

  /*
  app.get('/getMedicament', function(req, res)
  {

  });
  */
}

