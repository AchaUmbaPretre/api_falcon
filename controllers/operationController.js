const { db } = require("./../config/database");

exports.getOperation = (req, res) => {
    const q = `
    SELECT 
    operations.*, 
    client.nom_client, 
    superviseur.username AS superviseur, 
    site.nom_site, 
    traceur.numero_serie, 
    type_operations.nom_type_operations AS type_operations, 
    technicien.username AS technicien,
    user_cr.username AS user_cr
FROM operations 
    INNER JOIN client ON operations.id_client = client.id_client
    INNER JOIN users AS superviseur ON operations.id_superviseur = superviseur.id
    INNER JOIN users AS technicien ON operations.id_technicien = technicien.id
    INNER JOIN users AS user_cr ON operations.user_cr = user_cr.id
    INNER JOIN site ON operations.site = site.id_site
    INNER JOIN traceur ON operations.id_traceur = traceur.id_traceur
    INNER JOIN type_operations ON operations.id_type_operations = type_operations.id_type_operations
WHERE operations.est_supprime = 0
ORDER BY operations.date_operation DESC;

    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

/* exports.postOperation = async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "Aucun fichier téléchargé" });
    }

    const photoPlaqueFile = req.files['photo_plaque'][0]; 
    const photoTraceurFile = req.files['photo_traceur'][0];

    const photoPlaqueUrl = `/uploads/${photoPlaqueFile.filename}`;
    const photoTraceurUrl = `/uploads/${photoTraceurFile.filename}`;

    res.setHeader('Content-Type', 'multipart/form-data');

    try {
        const update = 'UPDATE traceur SET id_client = ?, id_etat_traceur = 7 WHERE id_traceur = ?'
        const q = 'INSERT INTO operations(`id_client`, `site`, `id_superviseur`,`id_technicien`, `date_operation`, `id_type_operations`,`id_traceur`,`probleme`,`observation`,`kilometre`, `tension`, `photo_plaque`,`photo_traceur`, `user_cr`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const values = [
            req.body.id_client,
            req.body.site,
            req.body.id_superviseur,
            req.body.id_technicien,
            req.body.date_operation,
            req.body.id_type_operations,
            req.body.id_traceur,
            req.body.probleme,
            req.body.observation,
            req.body.kilometre,
            req.body.tension,
            photoPlaqueUrl,
            photoTraceurUrl,
            req.body.user_cr
        ];

        db.query(q, values, (errorProduit, dataProduit) => {
            if (errorProduit) {
                console.log(errorProduit)
              res.status(500).json(errorProduit);
            } else {
                db.query(update, [req.body.id_client,req.body.id_traceur], (errorTraceur, dataTraceur) => {
                    if(errorTraceur){
                        console.log(errorProduit)
                        res.status(500).json(errorProduit);
                    }else{
                        return res.json({ message: 'Processus réussi' });
                    }
                })
            }
          });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'opération." });
    }
} */

exports.postOperation = async (req, res) => {
    try {
        if (!req.files || !req.files['photo_plaque'] || !req.files['photo_traceur']) {
            return res.status(400).json({ error: "Les fichiers photo_plaque et photo_traceur sont requis." });
        }

        const photoPlaqueFile = req.files['photo_plaque'][0];
        const photoTraceurFile = req.files['photo_traceur'][0];

        const photoPlaqueUrl = `/uploads/${photoPlaqueFile.filename}`;
        const photoTraceurUrl = `/uploads/${photoTraceurFile.filename}`;

        const insertQuery = `
            INSERT INTO operations (
                id_client, site, id_superviseur, id_technicien, date_operation, id_type_operations, 
                id_traceur, probleme, observation, kilometre, tension, photo_plaque, photo_traceur, user_cr
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.id_client,
            req.body.site,
            req.body.id_superviseur,
            req.body.id_technicien,
            req.body.date_operation,
            req.body.id_type_operations,
            req.body.id_traceur,
            req.body.probleme,
            req.body.observation,
            req.body.kilometre,
            req.body.tension,
            photoPlaqueUrl,
            photoTraceurUrl,
            req.body.user_cr
        ];

        await db.query(insertQuery, values);

        // Mettre à jour l'état du traceur en fonction de id_type_operations
        let updateQuery;
        if (req.body.id_type_operations === '1') {
            updateQuery = `UPDATE traceur SET id_client = ${req.body.id_client}, id_etat_traceur = 7 WHERE id_traceur = ${req.body.id_traceur}`;
        } else if (req.body.id_type_operations === '3') {
            updateQuery = `UPDATE traceur SET id_client = ${req.body.id_client}, id_etat_traceur = 2 WHERE id_traceur = ${req.body.id_traceur}`;
        }

        if (updateQuery) {
            await db.query(updateQuery);
        }

        return res.json({ message: 'Processus réussi' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'opération." });
    }
};


//Site
exports.getSite = (req, res) => {
    const q = `
    SELECT *
        FROM site
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

//Opération
exports.getTypeOperation = (req, res) => {
    const q = `
    SELECT *
        FROM type_operations
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}