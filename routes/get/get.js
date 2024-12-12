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
  /*
  app.get('/medicaments', authMiddleware, async function (req, res)
  {
   const medicaments = await connection.query('SELECT * FROM medicaments');

    // --- On renvoie un tableau de json
    return res.json({
      medicaments: medicaments[0]
    });
  });
  */

  /*
  app.get('/getMedicament', function(req, res)
  {

  });
  */

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.get('/medicaments', authMiddleware, async function(req,res) {
    
    let nameDrug = req.query.name;
    let typeSystem = req.query.system;
    console.log(nameDrug);
    console.log(typeSystem);
    

    // --- On crée la requête SQL de base
    let sql = 'SELECT * FROM medicaments';

    // --- Création du tableau de valeurs
    let tab = [];

    let count = 0;

    if (nameDrug)
    {
      count++;
    }
    if (typeSystem)
    {
      count++;
    }

    if (count == 1)
    {
      if (nameDrug)
      {
        sql += ' WHERE nom LIKE ?';
        tab.push('%'+nameDrug+'%');
      }
      // ---
      if (typeSystem)
        {
          sql += ' WHERE zone_action LIKE ?';
          tab.push('%'+typeSystem+'%');
        }
    }
    else if (count == 2)
    {
      sql += ' WHERE nom LIKE ? AND zone_action LIKE ?';
      tab.push('%'+nameDrug+'%', '%'+typeSystem+'%');
    }

    let medicaments = await connection.query(sql, tab)
    console.log(sql);
    

    // --- On retourne le/les médicament(s)
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


