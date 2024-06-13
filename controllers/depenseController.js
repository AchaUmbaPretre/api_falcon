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
    const q = `
    SELECT 
    depense.montant,
    depense.montant_franc,
    depense.date_depense,
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
GROUP BY 
    depense.montant,
    depense.montant_franc,
    depense.date_depense,
    depense.description,
    users.username,
    categorie_depense.nom_categorie,
    DAYOFWEEK(depense.date_depense);
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
    try {
        const { id_users, id_categorie, montant, montant_franc, description } = req.body;

        // Assurez-vous que montant et montant_franc sont des nombres
        const parsedMontant = parseFloat(montant);
        const parsedMontantFranc = parseFloat(montant_franc);


        const q = 'INSERT INTO depense(`id_users`, `id_categorie`, `montant`, `montant_franc`, `description`) VALUES (?, ?, ?, ?, ?)';
        const values = [id_users, id_categorie, parsedMontant, parsedMontantFranc, description];

        // Exécution de la requête SQL
        await db.query(q, values);

        return res.json('Processus réussi');
    } catch (error) {
        console.error("Erreur lors de l'ajout de la dépense :", error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout de la dépense." });
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