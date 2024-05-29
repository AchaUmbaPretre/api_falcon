const { db } = require("./../config/database");

exports.getMethode = (req, res) => {
    const q = `
    SELECT *
        FROM methode_paiement
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getPaiement = (req, res) => {
    const q = `
                SELECT paiement.*, client.nom_client, methode_paiement.nom_methode FROM paiement
            INNER JOIN client ON paiement.id_client
            INNER JOIN methode_paiement ON paiement.methode = methode_paiement.id_methode 
            `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}


exports.postPaiement = async (req, res) => {

    try {
        const q = 'INSERT INTO paiement(`id_client`, `montant`, `device`, `methode`) VALUES(?, ?, ?, ?)';

        const values = [
            req.body.id_client,
            req.body.montant,
            req.body.device,
            req.body.methode
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du vehicule." });
    }
}
