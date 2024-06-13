const { db } = require("./../config/database");

exports.getVehiculeCount = (req, res) => {
    const { searchValue } = req.query;
    console.log(searchValue)
    let q = `
    SELECT COUNT(id_vehicule) AS nbre_vehicule
    FROM vehicule 
    INNER JOIN client ON vehicule.id_client = client.id_client
    WHERE vehicule.est_supprime = 0
    `;

    const params = [];

    if (searchValue) {
        q += ` AND (vehicule.matricule LIKE ? OR client.nom_client LIKE ?)`;
        params.push(`%${searchValue}%`, `%${searchValue}%`);
    }
     
    db.query(q, params, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}


exports.getVehicule = (req, res) => {
    const id_client = req.query.id_client;
    let q = `
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


/* exports.postVehicule = async (req, res) => {
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
} */

/* exports.postVehicule = async (req, res) => {
    try {
        const checkMatriculeQuery = 'SELECT COUNT(*) AS count FROM vehicule WHERE matricule = ?';
        const insertVehiculeQuery = 'INSERT INTO vehicule(`id_marque`, `matricule`,`id_client`, `code`) VALUES(?,?,?,?)';

        const matricule = req.body.matricule;
        const id_marque = req.body.id_marque;
        const id_client = req.body.id_client;
        const code = req.body.code;

        const matriculeCheckResult = await db.query(checkMatriculeQuery, [matricule]);

        if (matriculeCheckResult[0].count > 0) {
            return res.status(400).json({ error: 'Le matricule existe déjà.' });
        } else {
            await db.query(insertVehiculeQuery, [id_marque, matricule, id_client, code]);
            return res.json('Processus réussi');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du véhicule." });
    }
} */


exports.postVehicule = async (req, res) => {
    try {
        const vehicles = req.body.vehicles;

        if (!vehicles || !Array.isArray(vehicles)) {
            return res.status(400).json({ error: 'Les données des véhicules sont invalides ou manquantes.' });
        }

        const checkMatriculeQuery = 'SELECT COUNT(*) AS count FROM vehicule WHERE matricule = ?';
        const insertVehiculeQuery = 'INSERT INTO vehicule(`id_marque`, `matricule`, `id_client`, `code`) VALUES(?, ?, ?, ?)';

        for (const vehicle of vehicles) {
            const { matricule, id_marque, id_client, code } = vehicle;

            const matriculeCheckResult = await new Promise((resolve, reject) => {
                db.query(checkMatriculeQuery, [matricule], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });

            const count = matriculeCheckResult[0].count;
            if (count > 0) {
                return res.status(400).json({ error: `Le matricule ${matricule} existe déjà.` });
            }
            
            await new Promise((resolve, reject) => {
                db.query(insertVehiculeQuery, [id_marque, matricule, id_client, code], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }

        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout des véhicules." });
    }
};



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

exports.deleteMarque = (req, res) => {
    const id_marque = req.params.id;
  
    const q = "DELETE marque WHERE id_marque= ?";
  
    db.query(q, [id_marque], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  
  }