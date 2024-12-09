import { request } from "express";

export default function (app, connection) {
  app.get('/test', function (req, res) {
    return res.json({
      status: "ok tout fonctionne"
    });
  });

  // --- Permet de récupérer tous les médicaments
  app.get('/medicaments', async function (req, res) {
    const medicaments = await connection.query('SELECT * FROM medicaments');

    // --- On renvoie un tableau de json
    return res.json({
      medicaments: medicaments[0]
    });
  });

  /*
  app.get('/getMedicament', function(req, res)
  {

  });
  */

  app.get('/search/:search', async function (req, res) {

    let nameDrug = req.params.search;

    let medicaments = await connection.query('SELECT * FROM medicaments WHERE nom LIKE ? ', [`%${nameDrug}`])

    return res.json({
      medicaments: medicaments[0]
    });
  })

}


