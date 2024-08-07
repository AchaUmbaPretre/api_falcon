const { db } = require("./../config/database");


exports.getRechargeClientTotal = (req, res) => {
    const q = `SELECT 
    client.*, 
    traceur.numero_serie, 
    traceur.id_traceur, 
    numero.numero,
    (
        SELECT COUNT(*)
        FROM traceur AS t
        WHERE t.id_client = client.id_client
        AND t.id_etat_traceur = 7
    ) AS nbre_actif
FROM 
    client
INNER JOIN 
    traceur 
ON 
    client.id_client = traceur.id_client
INNER JOIN 
    affectations 
ON 
    traceur.id_traceur = affectations.id_traceur
INNER JOIN 
    numero 
ON 
    affectations.id_numero = numero.id_numero
WHERE 
    client.est_supprime = 0
GROUP BY client.id_client;
`
db.query(q, (error, data) => {
    if (error) res.status(500).send(error);
    return res.status(200).json(data);
});

}

exports.getRechargeClientOne = (req, res) => {
    const id_client = req.query.id_client;

    const q = `SELECT 
                client.id_client,client.nom_client, 
                traceur.numero_serie, 
                traceur.id_traceur, 
                numero.numero,
                numero.id_numero
                FROM 
                    client
                INNER JOIN traceur ON client.id_client = traceur.id_client
                INNER JOIN affectations ON traceur.id_traceur = affectations.id_traceur
                INNER JOIN numero ON affectations.id_numero = numero.id_numero
                WHERE client.est_supprime = 0 AND traceur.id_etat_traceur = 7 AND client.id_client = ?
                `

    db.query(q, [id_client], (err, results) => {
    if (err) {
        console.error('Erreur lors de la récupération des permissions:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
    }
    res.json(results);
});

}

exports.getRecharge = (req, res) => {
    const { start_date, end_date, searchValue } = req.query;

    const query = `
    SELECT 
    recharge.id_recharge,
    recharge.date_recharge, 
    recharge.days,
    recharge.user_cr, 
    numero.numero, 
    traceur.numero_serie, 
    client.nom_client, 
    client.id_client,
    vehicule.matricule,
    users.username,
    marque.nom_marque,
    CASE 
        WHEN DATE_ADD(recharge.date_recharge, INTERVAL recharge.days DAY) <= CURDATE() THEN "Inactif"
        ELSE "Actif"
    END AS recharge_status,
    GREATEST(DATEDIFF(DATE_ADD(recharge.date_recharge, INTERVAL recharge.days DAY), CURDATE()), 0) AS days_restant
    FROM recharge
    INNER JOIN numero ON recharge.id_numero = numero.id_numero
    INNER JOIN affectations ON numero.id_numero = affectations.id_numero
    LEFT JOIN traceur ON affectations.id_traceur = traceur.id_traceur
    LEFT JOIN client ON traceur.id_client = client.id_client
    LEFT JOIN vehicule ON traceur.id_vehicule = vehicule.id_vehicule
    INNER JOIN marque ON vehicule.id_marque = marque.id_marque
    INNER JOIN users ON recharge.user_cr = users.id
    ${start_date ? `AND DATE(recharge.date_recharge) >= '${start_date}'` : ''}
    ${end_date ? `AND DATE(recharge.date_recharge) <= '${end_date}'` : ''}
    GROUP BY recharge.id_recharge
    `
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des permissions:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
        }
        res.json(results);
    });
};

/* exports.postRecharge = async (req, res) => {
    try {
        const q = 'INSERT INTO recharge (`id_client`, `id_traceur`, `id_numero`,`days`, `user_cr`) VALUES (?, ?, ?, ?, ?)';
        const values = [
            req.body.id_client,
            req.body.id_traceur,
            req.body.id_numero,
            req.body.days,
            req.body.user_cr
        ];

        db.query(q, values, (errorProduit, dataProduit) => {
            if (errorProduit) {
                console.error(errorProduit);
                return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du produit." });
            } else {
                return res.json({ message: 'Processus réussi' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du contact." });
    }
} */

exports.postRecharge = async (req, res) => {
        try {
            const { id_client, id_traceur, id_numero, days, user_cr } = req.body;
    
            // Vérifiez si le numéro a déjà été rechargé aujourd'hui
            const checkQuery = `
                SELECT COUNT(*) AS count FROM recharge 
                WHERE id_numero = ? AND DATE(created_at) = CURDATE()
            `;
            db.query(checkQuery, [id_numero], (errorCheck, resultCheck) => {
                if (errorCheck) {
                    console.error(errorCheck);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de la vérification du numéro." });
                }
    
                if (resultCheck[0].count > 0) {
                    return res.status(400).json({ error: "Le numéro a déjà été rechargé aujourd'hui." });
                }
    
                // Procédez à l'insertion si le numéro n'a pas été rechargé aujourd'hui
                const insertQuery = 'INSERT INTO recharge (`id_client`, `id_traceur`, `id_numero`,`days`, `user_cr`) VALUES (?, ?, ?, ?, ?)';
                const values = [id_client, id_traceur, id_numero, days, user_cr];
    
                db.query(insertQuery, values, (errorInsert, dataInsert) => {
                    if (errorInsert) {
                        console.error(errorInsert);
                        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du produit." });
                    } else {
                        return res.json({ message: 'Processus réussi' });
                    }
                });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du contact." });
        }
    };

exports.deleteRecharge = (req, res) => {
    const id_recharge = req.params.id;
  
    const q = "DELETE recharge WHERE id_recharge = ?";
  
    db.query(q, [id_recharge], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  
  }