const { db } = require("./../config/database");


exports.getTraceur = (req, res) => {
    const q = `
    SELECT traceur.*, model_traceur.nom_model, etat_traceur.nom_etat_traceur
        FROM traceur 
        INNER JOIN model_traceur ON traceur.model = model_traceur.id_model_traceur
        INNER JOIN etat_traceur ON traceur.id_etat_traceur = etat_traceur.id_etat_traceur
    WHERE est_supprime = 0
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
        const q = 'INSERT INTO traceur(`model`,`id_client`,`numero_serie`, `id_etat_traceur`) VALUES(?,?,?,?)';

        const values = [
            req.body.model,
            req.body.id_client,
            req.body.numero_serie,
            req.body.id_etat_traceur || 1
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du traceur." });
    }
}