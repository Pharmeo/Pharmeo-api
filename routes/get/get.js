export default function (app, connection) 
{
  app.get('/test', function (req, res)
  {
      res.json({
        status : "ok"
      });
  });

  // --- Permet de récupérer tous lles médicaments
  /*
  app.get('getAllMedicaments', function(req, res)
  {
    connection.query('SELECT * FROM medicaments');

    // --- On renvoie un tableau de json
    res.json({

    });
  });
  */

  /*
  app.get('/getMedicament', function(req, res)
  {

  });
  */
}

