const { db } = require("./../config/database");

exports.getAffectations = (req, res) => {
    const q = `
    SELECT *
        FROM affectations 
    WHERE est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postAffectations = async (req, res) => {
    try {
        const q = 'INSERT INTO affectations(`id_numero`, `id_traceur` ) VALUES(?,?)';
        const values = [
            req.body.id_numero,
            req.body.id_traceur
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du client." });
    }
}