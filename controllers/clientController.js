const { db } = require("./../config/database");

exports.getClientCount = (req, res) => {
    const q = `
    SELECT COUNT(id_client) AS nbre_client
        FROM client 
    WHERE est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getClients = (req, res) => {
    const q = `
    SELECT *
        FROM client 
    WHERE est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getClientAll = (req, res) => {
    const id_client = req.query.id_client;
    const q = `
        SELECT client.*, contact_client.nom_contact, contact_client.telephone_contact, contact_client.poste_contact, contact_client.email_contact
            FROM client 
            LEFT JOIN contact_client ON client.id_client = contact_client.id_client
        WHERE est_supprime = 0 AND client.id_client =${id_client}
            `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postClient = async (req, res) => {
    try {
        const q = 'INSERT INTO client(`nom_client`, `nom_principal`, `poste`, `telephone`, `adresse`, `email`) VALUES(?,?,?,?,?,?)';
        const values = [
            req.body.nom_client,
            req.body.nom_principal,
            req.body.poste,
            req.body.telephone,
            req.body.adresse,
            req.body.email,
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du client." });
    }
}


exports.postClientContact = async (req, res) => {

    try {
        const q = 'INSERT INTO contact_client(`id_client`,`nom_contact`, `telephone_contact`, `poste_contact`, `email_contact`) VALUES(?,?,?,?,?)';
        const values = [
            req.body.id_client,
            req.body.nom_contact,
            req.body.telephone_contact,
            req.body.poste_contact,
            req.body.email_contact
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        console.log(error)
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du contact." });
    }
}
