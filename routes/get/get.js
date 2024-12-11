import { request } from "express";

export default function (app, connection, authMiddleware) 
{
  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.get('/test', function (req, res)
  {
      return res.json({
        status : "ok tout fonctionne"
      });
  });

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // --- Permet de récupérer tous les médicaments
  app.get('/medicaments', authMiddleware, async function (req, res)
  {
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

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.get('/search/:search', authMiddleware, async function(req,res) {
    
    let nameDrug = req.params.search;

    let medicaments = await connection.query('SELECT * FROM medicaments WHERE nom LIKE ? ', [`%${nameDrug}%`])

    return res.json({
      medicaments: medicaments[0]
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.get('/medicaments/:page', authMiddleware, async function (req, res)
  {
    // --- On calcule le nombre de médicaments à récupérer
    const page = req.params.page;
    const offset = (25*page) - 25;

    const medicaments = await connection.query('SELECT * FROM medicaments LIMIT ? OFFSET ?', [25, offset]);

    // --- On renvoie un tableau de json
    return res.json({
      medicaments: medicaments[0]
    });
  });
}


