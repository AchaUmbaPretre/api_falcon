const { db } = require("./../config/database");


exports.getTraceurCount = (req, res) => {
    const q = `
    SELECT COUNT(id_traceur) AS nbre_traceur
        FROM traceur 
    WHERE est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getTraceur = (req, res) => {
    const q = `
            SELECT traceur.*, model_traceur.nom_model, etat_traceur.nom_etat_traceur, client.nom_client
        FROM traceur 
        INNER JOIN model_traceur ON traceur.model = model_traceur.id_model_traceur
        LEFT JOIN etat_traceur ON traceur.id_etat_traceur = etat_traceur.id_etat_traceur
        LEFT JOIN client ON traceur.id_client = client.id_client
        WHERE traceur.est_supprime = 0
        ORDER BY traceur.date_entree DESC;
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getTraceurEtat = (req, res) => {
    const q = `
    SELECT *
        FROM etat_traceur
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getModelTraceur = (req, res) => {
    const q = `
    SELECT *
        FROM model_traceur
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postTraceur = async (req, res) => {
    try {
        const checkQuery = 'SELECT COUNT(*) AS count FROM traceur WHERE numero_serie = ?';
        
        db.query(checkQuery, [req.body.numero_serie], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de la vérification du traceur." });
            }

            if (results[0].count > 0) {
                return res.status(400).json({ message: `Le traceur avec le numéro de série ${req.body.numero_serie} existe déjà.` });
            }

            const insertQuery = 'INSERT INTO traceur(`model`, `id_client`, `numero_serie`, `id_etat_traceur`, `id_vehicule`) VALUES(?,?,?,?,?)';
            const values = [
                req.body.model,
                req.body.id_client,
                req.body.numero_serie,
                req.body.id_etat_traceur || 1,
                req.body.id_vehicule
            ];

            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du traceur." });
                }

                return res.json('Processus réussi');
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du traceur." });
    }
};
