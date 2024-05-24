const { db } = require("./../config/database");

exports.getVehiculeCount = (req, res) => {
    const q = `
    SELECT COUNT(id_vehicule) AS nbre_vehicule
        FROM vehicule 
    WHERE est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getVehicule = (req, res) => {
    const id_client = req.query.id_client;
    const q = `
        SELECT vehicule.*, marque.nom_marque, client.nom_client
        FROM vehicule
        INNER JOIN marque ON vehicule.id_marque = marque.id_marque
        INNER JOIN client ON client.id_client = vehicule.id_client
        ${id_client ? `WHERE client.id_client = ?` : ''}
    `;

    const params = id_client ? [id_client] : [];

    db.query(q, params, (error, data) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(200).json(data);
    });
};


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

exports.postMarque = async (req, res) => {
    try {
        const q = 'INSERT INTO marque(`nom_marque`) VALUES(?)';

        const values = [
            req.body.nom_marque
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du vehicule." });
    }
}