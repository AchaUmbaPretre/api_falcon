const { db } = require("./../config/database");


exports.getVehicule = (req, res) => {
    const q = `
    SELECT *
        FROM vehicule 
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postVehicule = async (req, res) => {
    try {
        const q = 'INSERT INTO vehicule(`nom_vehicule`) VALUES(?)';

        const values = [
            req.body.vehicule
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du traceur." });
    }
}