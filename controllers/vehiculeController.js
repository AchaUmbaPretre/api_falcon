const { db } = require("./../config/database");


exports.getVehicule = (req, res) => {
    const q = `
        SELECT *, marque.nom_marque, client.nom_client
            FROM vehicule 
        INNER JOIN marque ON vehicule.id_marque = marque.id_marque
        INNER JOIN client ON client.id_client = vehicule.id_client
            `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postVehicule = async (req, res) => {
    try {
        const q = 'INSERT INTO vehicule(`id_marque`, `matricule`,`id_client`, `code`) VALUES(?,?,?,?)';

        const values = [
            req.body.id_marque,
            req.body.matricule,
            req.body.id_client,
            req.body.code
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du vehicule." });
    }
}

exports.getMarque = (req, res) => {
    const q = `
    SELECT *
        FROM marque 
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}