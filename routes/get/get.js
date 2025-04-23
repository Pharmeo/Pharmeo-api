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
    let location = req.query.location;

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

    // --- On crée la requête SQL de base
    let sql = ''; 

    // --- Gestion de la présence dans une pharmacie ou une autre
    if (location)
    {
      sql += 'SELECT medicaments.*, relations_pharmacies_medicaments.quantite FROM medicaments'
            +' INNER JOIN relations_pharmacies_medicaments'
            +' ON medicaments.identifiant = relations_pharmacies_medicaments.identifiant_medicament'
            +' WHERE relations_pharmacies_medicaments.identifiant_pharmacie = ?'
      tab.push(location);
      // ---
      if (count >= 1)
        {
          sql += ' AND ';
        }
    }
    else
    {
      sql += 'SELECT * FROM medicaments WHERE ';
    }

    // --- Gestion de la construction de la requête
    if (count == 1)
    {
      if (nameDrug)
      {
        sql += 'nom LIKE ?';
        tab.push('%'+nameDrug+'%');
      }
      // ---
      if (typeSystem)
        {
          sql += 'zone_action LIKE ?';
          tab.push('%'+typeSystem+'%');
        }
    }
    else if (count == 2)
    {
      sql += ' nom LIKE ? AND zone_action LIKE ?';
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

    let [infos_supplementaires] = await connection.query('SELECT identifiant, nom, adresse, longitude, latitude, ville, code_postal, identifiant_medicament, quantite FROM relations_pharmacies_medicaments'
      +' INNER JOIN pharmacies'
      +' ON relations_pharmacies_medicaments.identifiant_pharmacie = pharmacies.identifiant'
      +' WHERE identifiant_medicament = ?',[idMedicament])

    // --- La réponse à la requête
    res.json({
      infos_supplementaires : infos_supplementaires
    });
  })

  //-----------------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  app.get('/comptes', authMiddleware, async function(req,res) 
  {
    let [comptes] = await connection.query('SELECT * FROM comptes')

    // --- La réponse à la requête
    res.json({
      comptes : comptes
    });
  })
}


