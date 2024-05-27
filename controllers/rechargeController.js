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
        INNER JOIN affectations AS a ON t.id_traceur = a.id_traceur
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
    client.est_supprime = 0;
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
                numero.numero
                FROM 
                    client
                INNER JOIN traceur ON client.id_client = traceur.id_client
                INNER JOIN affectations ON traceur.id_traceur = affectations.id_traceur
                INNER JOIN numero ON affectations.id_numero = numero.id_numero
                WHERE client.est_supprime = 0 AND traceur.id_etat_traceur = 7 AND client.id_client = ?`

    db.query(q, [id_client], (err, results) => {
    if (err) {
        console.error('Erreur lors de la récupération des permissions:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
    }
    res.json(results);
});

}

exports.getRecharge = (req, res) => {
    const query = 'SELECT * FROM recharge';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des permissions:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
        }
        res.json(results);
    });
};

exports.postRecharge = async (req, res) => {

    try {
        const q = 'INSERT INTO recharge(`id_client`,`id_numero`) VALUES(?,?)';
        const values = [
            req.body.id_client,
            req.body.id_numero
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        console.log(error)
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du contact." });
    }
}

exports.deleteRecharge = (req, res) => {
    const id_recharge = req.params.id;
  
    const q = "DELETE recharge WHERE id_recharge = ?";
  
    db.query(q, [id_recharge], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  
  }