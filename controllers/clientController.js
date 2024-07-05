const { db } = require("./../config/database");

exports.getClientCount = (req, res) => {
    const { searchValue } = req.query;
    
    let q = `
    SELECT COUNT(id_client) AS nbre_client
    FROM client 
    WHERE est_supprime = 0
    `;

    const params = [];

    if (searchValue) {
        q += ` AND (nom_client LIKE ? OR nom_principal LIKE ?)`;
        params.push(`%${searchValue}%`, `%${searchValue}%`);
    }
     
    db.query(q, params, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getClientCountJour = (req, res) => {
    
    let q = `
    SELECT COUNT(id_client) AS nbre_client
    FROM client 
    WHERE est_supprime = 0 AND DATE(created_at) = CURDATE()
    `;
    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getClientCountHier = (req, res) => {
    
    let q = `
    SELECT COUNT(id_client) AS nbre_client
    FROM client 
    WHERE est_supprime = 0 AND DATE(created_at)= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    `;
    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getClientCount7jours = (req, res) => {
    
    let q = `
    SELECT COUNT(id_client) AS nbre_client
    FROM client 
    WHERE est_supprime = 0 AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `;
    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getClientCount30jours = (req, res) => {
    
    let q = `
    SELECT COUNT(id_client) AS nbre_client
    FROM client 
    WHERE est_supprime = 0 AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `;
    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getClientCount1an = (req, res) => {
    
    let q = `
    SELECT COUNT(id_client) AS nbre_client
    FROM client 
    WHERE est_supprime = 0 AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    `;
    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}



exports.getClients = (req, res) => {
    const { page = 1, limit = 10 } = req.query; 
    const offset = (page - 1) * limit;

    const q = `
    SELECT *
    FROM client 
    WHERE est_supprime = 0
    LIMIT ? OFFSET ?
    `;

    db.query(q, [parseInt(limit), parseInt(offset)], (error, data) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(200).json(data);
    });
};


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

exports.getClientOne = (req, res) => {
    const id_client = req.query.id_client;
    const q = `
        SELECT client.*, contact_client.nom_contact, contact_client.telephone_contact, contact_client.poste_contact, contact_client.email_contact
            FROM client 
        WHERE est_supprime = 0 AND client.id_client =${id_client}
            `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}


/* exports.postClient = async (req, res) => {
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
} */


exports.postClient = async (req, res) => {

    try {
        const checkClientQuery = 'SELECT COUNT(*) AS count FROM client WHERE nom_client = ?';
        const insertClientQuery = 'INSERT INTO client(`nom_client`, `nom_principal`, `poste`, `telephone`, `adresse`, `email`) VALUES(?,?,?,?,?,?)';

        const { nom_client, nom_principal, poste, telephone, adresse, email } = req.body;

        const clientCheckResult = await new Promise((resolve, reject) => {
            db.query(checkClientQuery, [nom_client], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const count = clientCheckResult[0].count;
        if (count > 0) {
            return res.status(400).json({ error: 'Le client existe déjà avec ce nom.' });
        }

        await db.query(insertClientQuery, [nom_client, nom_principal, poste, telephone, adresse, email]);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du client." });
    }
};

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


exports.deleteClient = (req, res) => {
    const id = req.params.id;
  
    const q = "DELETE client WHERE id_client = ?";
  
    db.query(q, [id], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  
  }