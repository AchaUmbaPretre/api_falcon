const { db } = require("./../config/database");
const util = require('util');


exports.getTraceurCount = (req, res) => {
    const { searchValue } = req.query;

    let q = `
    SELECT COUNT(id_traceur) AS nbre_traceur,
        (SELECT COUNT(id_traceur) FROM traceur WHERE traceur.id_etat_traceur = 1) AS Nbre_neuf,
        (SELECT COUNT(id_traceur) FROM traceur WHERE traceur.id_etat_traceur = 2) AS Nbre_dementele,
        (SELECT COUNT(id_traceur) FROM traceur WHERE traceur.id_etat_traceur = 5) AS Nbre_defectueux,
        (SELECT COUNT(id_traceur) FROM traceur WHERE traceur.id_etat_traceur = 6) AS Nbre_suspendu,
        (SELECT COUNT(id_traceur) FROM traceur WHERE traceur.id_etat_traceur = 7) AS Nbre_actif
    FROM traceur 
    INNER JOIN etat_traceur ON traceur.id_etat_traceur = etat_traceur.id_etat_traceur
    LEFT JOIN client ON traceur.id_client = client.id_client
    WHERE traceur.est_supprime = 0
    `;

    const params = [];

    if (searchValue) {
        q += ` AND (client.nom_client LIKE ? OR etat_traceur.nom_etat_traceur LIKE ?)`;
        params.push(`%${searchValue}%`, `%${searchValue}%`);
    }
     
    db.query(q, params, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getTraceur = (req, res) => {
    const { start_date, end_date, searchValue, idTraceur } = req.query;

    const q = `
    SELECT traceur.*, model_traceur.nom_model, etat_traceur.nom_etat_traceur, client.nom_client, vehicule.matricule, marque.nom_marque, numero.numero
        FROM traceur 
        INNER JOIN model_traceur ON traceur.model = model_traceur.id_model_traceur
        LEFT JOIN etat_traceur ON traceur.id_etat_traceur = etat_traceur.id_etat_traceur
        LEFT JOIN client ON traceur.id_client = client.id_client
        LEFT JOIN vehicule ON traceur.id_vehicule = vehicule.id_vehicule
        LEFT JOIN marque ON vehicule.id_marque = marque.id_marque
        LEFT JOIN affectations ON traceur.id_traceur = affectations.id_traceur
        LEFT JOIN numero ON affectations.id_numero = numero.id_numero
    WHERE traceur.est_supprime = 0 ${idTraceur ? 'AND traceur.id_traceur = ?' : ''}
    ${start_date ? `AND DATE(traceur.date_entree) >= '${start_date}'` : ''}
    ${end_date ? `AND DATE(traceur.date_entree) <= '${end_date}'` : ''}
        ORDER BY traceur.date_entree DESC;
    `;
     
    const queryParams = idTraceur ? [idTraceur] : [];

    db.query(q, queryParams, (error, data) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(200).json(data);
    });
};

exports.getTraceurHistorique = (req, res) => {
    const id_traceur = req.query.idTraceur;

    const q = `
    SELECT 
<<<<<<< HEAD
    traceur.id_traceur, traceur.model, traceur.numero_serie,traceur.code, 
=======
    traceur.*, 
>>>>>>> fe54c32284228a93e6de674875d0a5be2fa9032c
    model_traceur.nom_model, 
    etat_traceur.nom_etat_traceur, 
    client.nom_client, 
    vehicule.matricule, 
    marque.nom_marque, 
    numero.numero, 
    operations.date_operation,
    operations.photo_plaque,
    operations.photo_traceur,
    operations.probleme,
    operations.observation,
    operations.kilometre,
    operations.tension,
    type_operations.nom_type_operations,
    superviseur.username AS superviseur,
    technicien.username AS technicien
    
FROM 
    traceur 
INNER JOIN 
    model_traceur ON traceur.model = model_traceur.id_model_traceur
LEFT JOIN 
    etat_traceur ON traceur.id_etat_traceur = etat_traceur.id_etat_traceur
LEFT JOIN 
<<<<<<< HEAD
    operations ON traceur.id_traceur = operations.id_traceur
LEFT JOIN 
    client ON operations.id_client = client.id_client
=======
    client ON traceur.id_client = client.id_client
>>>>>>> fe54c32284228a93e6de674875d0a5be2fa9032c
LEFT JOIN 
    affectations ON traceur.id_traceur = affectations.id_traceur
LEFT JOIN 
    numero ON affectations.id_numero = numero.id_numero
<<<<<<< HEAD
=======
LEFT JOIN 
    operations ON traceur.id_traceur = operations.id_traceur
>>>>>>> fe54c32284228a93e6de674875d0a5be2fa9032c
LEFT JOIN vehicule ON operations.id_vehicule = vehicule.id_vehicule
LEFT JOIN 
    marque ON vehicule.id_marque = marque.id_marque
INNER JOIN 
    type_operations ON operations.id_type_operations = type_operations.id_type_operations
LEFT JOIN 
    users AS superviseur ON operations.id_superviseur = superviseur.id
LEFT JOIN 
    users AS technicien ON operations.id_technicien = technicien.id
WHERE 
    traceur.est_supprime = 0 
    AND traceur.id_traceur = ?
<<<<<<< HEAD
GROUP BY operations.id_operations
=======
>>>>>>> fe54c32284228a93e6de674875d0a5be2fa9032c
ORDER BY 
    operations.date_operation DESC;
    `;
     
    const queryParams = id_traceur ? [id_traceur] : [];

    db.query(q, queryParams, (error, data) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(200).json(data);
    });
};

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
        const insertQuery = 'INSERT INTO traceur(`model`, `id_client`, `numero_serie`,`code`, `id_etat_traceur`, `id_vehicule`) VALUES(?,?,?,?,?,?)';
        
        const queryAsync = util.promisify(db.query).bind(db);

        const results = await queryAsync(checkQuery, [req.body.numero_serie]);
        
        if (results[0].count > 0) {
            return res.status(400).json({ message: `Le traceur avec le numéro de série ${req.body.numero_serie} existe déjà.` });
        }
        const values = [
            req.body.model,
            req.body.id_client,
            req.body.numero_serie,
            req.body.code,
            req.body.id_etat_traceur || 1,
            req.body.id_vehicule
        ];

        await queryAsync(insertQuery, values);
        
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du traceur." });
    }
};

