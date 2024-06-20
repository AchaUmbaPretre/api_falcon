const { db } = require("./../config/database");
const { validationResult } = require('express-validator');

/* exports.getDepense = (req, res) => {
    const q = `
    SELECT depense.montant, depense.date_depense, depense.description, users.username,
     categorie_depense.nom_categorie 
     FROM depense
        INNER JOIN users ON depense.id_users = users.id
        INNER JOIN categorie_depense ON depense.id_categorie = categorie_depense.id_categorie_depense
    WHERE depense.est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
} */

exports.getDepense = (req, res) => {
    const { date } = req.query;
    const q = `
    SELECT 
        depense.montant,
        depense.montant_franc,
        DATE_FORMAT(CONVERT_TZ(depense.date_depense, '+00:00', @@session.time_zone), '%Y-%m-%d') AS date_depense,
        depense.description,
        users.username,
        categorie_depense.nom_categorie,
        CASE DAYOFWEEK(depense.date_depense)
            WHEN 1 THEN 'dimanche'
            WHEN 2 THEN 'lundi'
            WHEN 3 THEN 'mardi'
            WHEN 4 THEN 'mercredi'
            WHEN 5 THEN 'jeudi'
            WHEN 6 THEN 'vendredi'
            WHEN 7 THEN 'samedi'
        END AS jour,
        ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2) AS montant_total_combine
    FROM depense
    INNER JOIN users ON depense.id_users = users.id
    INNER JOIN categorie_depense ON depense.id_categorie = categorie_depense.id_categorie_depense
    WHERE depense.est_supprime = 0 
    ${date ? `AND DATE(depense.date_depense) = DATE(STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'))` : ''}
    GROUP BY 
        depense.montant,
        depense.montant_franc,
        depense.date_depense,
        depense.description,
        users.username,
        categorie_depense.nom_categorie,
        DAYOFWEEK(depense.date_depense);
    `;

    const params = date ? [date] : [];

    db.query(q, params, (error, data) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(200).json(data);
    });
};


exports.getDepenseJour = (req, res) => {

    const q = `SELECT 
                CASE
                    WHEN SUM(depense.montant) IS NOT NULL THEN ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2)
                    ELSE ROUND(SUM(depense.montant_franc * 0.00036), 2)
                END AS total_depense
                FROM depense
                  WHERE DATE(depense.date_depense) = CURDATE()
                GROUP BY DATE(depense.date_depense)
                `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
  }
  
exports.getDepenseHier = (req, res) => {
  
    const q = `SELECT 
                CASE
                    WHEN SUM(depense.montant) IS NOT NULL THEN ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2)
                    ELSE ROUND(SUM(depense.montant_franc * 0.00036), 2)
                END AS total_depense
                FROM depense
                  WHERE DATE(depense.date_depense) =  DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                GROUP BY DATE(depense.date_depense)
                `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
  }
  
exports.getDepense7jours = (req, res) => {
  
    const q = `SELECT 
                CASE
                    WHEN SUM(depense.montant) IS NOT NULL THEN ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2)
                    ELSE ROUND(SUM(depense.montant_franc * 0.00036), 2)
                END AS total_depense
                FROM depense
                  WHERE DATE(depense.date_depense) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY DATE(depense.date_depense)
              `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
  }
  
exports.getDepense30jours = (req, res) => {
  
    const q = `SELECT 
                CASE
                    WHEN SUM(depense.montant) IS NOT NULL THEN ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2)
                    ELSE ROUND(SUM(depense.montant_franc * 0.00036), 2)
                END AS total_depense
                FROM depense
                  WHERE DATE(depense.date_depense) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY DATE(depense.date_depense)
                `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
  }
  
exports.getDepense1an = (req, res) => {
  
    const q = `SELECT 
              CASE
                  WHEN SUM(depense.montant) IS NOT NULL THEN ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2)
                  ELSE ROUND(SUM(depense.montant_franc * 0.00036), 2)
              END AS total_depense
              FROM depense
                WHERE DATE(depense.date_depense) >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
              GROUP BY DATE(depense.date_depense)
                `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
  }



exports.getTypeDepense = (req, res) => {
    const q = `
    SELECT * FROM categorie_depense
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}


/* exports.postDepense = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const q = 'INSERT INTO depense(`id_users`, `id_categorie`, `montant`,`montant_franc`, `description`) VALUES(?,?,?,?,?)';
        const values = [
            req.body.id_users,
            req.body.id_categorie,
            req.body.montant,
            req.body.montant_franc,
            req.body.description
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du client." });
    }
}
 */

exports.postDepense = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const q = 'INSERT INTO depense(`id_users`, `id_categorie`, `montant`,`montant_franc`, `description`) VALUES(?,?,?,?,?)';
        const values = [
            req.body.id_users,
            req.body.id_categorie,
            req.body.montant,
            req.body.montant_franc,
            req.body.description
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du client." });
    }
}


exports.deleteDepense = (req, res) => {
    const id = req.params.id;
  
    const q = "DELETE depense WHERE id_depense = ?";
  
    db.query(q, [id], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  
  }


exports.getPaiementMois = (req, res) => {
  
      const q = `SELECT MONTH(paiement.date_paiement) AS mois, SUM(paiement.montant) AS paiement_total
      FROM paiement
      GROUP BY mois`;
    
      db.query(q ,(error, data)=>{
        if(error) res.status(500).send(error)
    
        return res.status(200).json(data);
    })
    }

exports.getDepenseAllMois = (req, res) => {
        
        const mainQuery = `
            SELECT 
                DATE_FORMAT(depense.date_depense, '%W') AS jour_semaine,
                DAY(depense.date_depense) AS jour,
                categorie_depense.nom_categorie, 
                depense.montant AS montant_dollars,
                depense.montant_franc AS montant_franc,
                ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2) AS total_depense,
                depense.date_depense AS date_depense
            FROM 
                depense
            INNER JOIN 
                categorie_depense ON depense.id_categorie = categorie_depense.id_categorie_depense
            WHERE 
                depense.est_supprime = 0
            GROUP BY 
            DATE(depense.date_depense);
        `;
        
        db.query(mainQuery, (error, data) => {
            if (error) {
                console.error("Erreur lors de l'exécution de la requête :", error);
                return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
            }
            
            
            const formattedData = data.map(row => ({
                jour_semaine: convertDayToFrench(row.jour_semaine), // Convertir le jour de la semaine en français
                jour: row.jour,
                nom_categorie: row.nom_categorie,
                total_depense: row.total_depense,
                date_depense : row.date_depense,
                montant_dollars : row.montant_dollars,
                montant_franc : row.montant_franc
            }));
    
            return res.status(200).json(formattedData);
        });
    }
    
    function convertDayToFrench(dayName) {
        const frenchDays = {
            Monday: 'Lundi',
            Tuesday: 'Mardi',
            Wednesday: 'Mercredi',
            Thursday: 'Jeudi',
            Friday: 'Vendredi',
            Saturday: 'Samedi',
            Sunday: 'Dimanche'
        };
    
        return frenchDays[dayName] || dayName;
    }
    
    

exports.getDepenseMois = (req, res) => {
      
    const q = `SELECT 
          MONTH(depense.date_depense) AS mois, 
          categorie_depense.nom_categorie, 
          ROUND(SUM(depense.montant), 2) + ROUND(SUM(depense.montant_franc * 0.00036), 2) AS total_depense
      FROM 
          depense
      INNER JOIN 
          categorie_depense ON depense.id_categorie = categorie_depense.id_categorie_depense
      WHERE 
          depense.est_supprime = 0
      GROUP BY 
          MONTH(depense.date_depense), 
          categorie_depense.nom_categorie;
      `;
        
          db.query(q ,(error, data)=>{
            if(error) res.status(500).send(error)
        
            return res.status(200).json(data);
        })
        }