const { db } = require("./../config/database");


exports.getTraceur = (req, res) => {
    const q = `
    SELECT *
        FROM traceur 
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

exports.postTraceur = async (req, res) => {
    try {
        const q = 'INSERT INTO traceur(`model`, `commentaire`, `id_client`,`numero_serie`, `id_etat_traceur`, `observation`) VALUES(?,?,?,?,?,?)';

        const values = [
            req.body.model,
            req.body.commentaire,
            req.body.id_client,
            req.body.numero_serie,
            req.body.id_etat_traceur,
            req.body.observation
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du traceur." });
    }
}