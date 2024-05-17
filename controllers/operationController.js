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

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "Aucun fichier téléchargé" });
    }

    const { photo_plaque, photo_traceur } = req.files;


    // Récupère les chemins d'accès des fichiers téléchargés
    const photoPlaqueUrl = photo_plaque[0].path;
    const photoTraceurUrl = photo_traceur[0].path;
    res.setHeader('Content-Type', 'multipart/form-data');

    try {
        const q = 'INSERT INTO operations(`id_client`, `site`, `id_superviseur`,`id_technicien`, `date_operation`, `id_type_operation`,`id_traceur`,`probleme`,`observation`,`kilometre`, `tension`, `photo_plaque`,`photo_traceur`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const values = [
            req.body.id_client,
            req.body.site,
            req.body.id_superviseur,
            req.body.id_technicien,
            req.body.date_operation,
            req.body.id_type_operation,
            req.body.id_traceur,
            req.body.probleme,
            req.body.observation,
            req.body.kilometre,
            req.body.tension,
            photoPlaqueUrl,
            photoTraceurUrl
        ];

        db.query(q, values, (errorProduit, dataProduit) => {
            if (errorProduit) {
                console.log(errorProduit)
              res.status(500).json(errorProduit);
            } else {
              return res.json({ message: 'Processus réussi' });
            }
          });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'opération." });
    }
}

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