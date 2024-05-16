const { db } = require("./../config/database");

exports.getOperation = (req, res) => {
    const q = `
    SELECT operations.*, client.nom_client
        FROM operations 
        INNER JOIN client ON operations.id_client = client.id_client
    WHERE operations.est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postOperation = async (req, res) => {
    try {
        const q = 'INSERT INTO operations(`id_client`, `site`, `id_superviseur`) VALUES(?,?,?)';
        const values = [
            req.body.id_client,
            req.body.site,
            req.body.id_superviseur
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'opération." });
    }
}