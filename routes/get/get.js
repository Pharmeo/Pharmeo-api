import { request } from "express";

export default function (app, connection, authMiddleware) 
{
  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // --- Simple test permettant de vérifier qu'il est possible d'utiliser l'API
  app.get('/test', function (req, res)
  {
      return res.json({
        status : "ok tout fonctionne"
      });
  });

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // --- Permet de récupérer l'intégralité de tous les médicaments
  app.get('/medicaments', authMiddleware, async function(req,res) {
    
    let nameDrug = req.query.name;
    let typeSystem = req.query.system;

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

    // --- On retourne le/les médicament(s)
    return res.json({
      medicaments: medicaments[0]
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  // --- Permet de faire la pagination en calculant un certain de nombre de médicaments à répartir
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

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.get('/favoris/:idCompte', authMiddleware, async function(req,res) 
  {
    let idCompte = req.params.idCompte;

    let [favoris] = await connection.query('SELECT * FROM favoris INNER JOIN medicaments ON favoris.id_medicament = medicaments.identifiant WHERE id_compte =?',[idCompte])

    // --- La réponse à la requête
    res.json({
      favoris : favoris
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.get('/medicaments/infosSupplementaires/:idMedicament', authMiddleware, async function(req,res) 
  {
    let idMedicament = req.params.idMedicament;

    let [infosSupplementaires] = await connection.query('SELECT * FROM relations_pharmacies_medicaments WHERE identifiant_medicament = ?',[idMedicament])

    // --- La réponse à la requête
    res.json({
      infosSupplementaires : infosSupplementaires[0]
    });
  })
}


