const { db } = require("./../config/database");

exports.getAffectations = (req, res) => {
    const q = `
    SELECT *, numero.numero, traceur.model
        FROM affectations 
        INNER JOIN numero ON affectations.id_numero = numero.id_numero
        INNER JOIN traceur ON affectations.id_traceur = traceur.id_traceur
    WHERE affectations.est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postAffectations = async (req, res) => {
    try {
        const checkQuery = 'SELECT COUNT(*) AS count FROM affectations WHERE id_traceur = ?';
        
        db.query(checkQuery, [req.body.id_traceur], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de la vérification du traceur." });
            }

            if (results[0].count > 0) {
                return res.status(400).json({ message: `Le traceur numero ${req.body.id_traceur} est déjà associé à un numéro.` });
            }

            const insertQuery = 'INSERT INTO affectations(`id_numero`, `id_traceur`) VALUES(?,?)';
            const values = [
                req.body.id_numero,
                req.body.id_traceur
            ];

            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout de l'affectation." });
                }

                return res.json('Processus réussi');
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout de l'affectation." });
    }
};

//Numero
exports.getNumero = (req, res) => {
    const q = `
    SELECT *
        FROM numero
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postNumero = async (req, res) => {
    try {
        const checkQuery = 'SELECT COUNT(*) AS count FROM numero WHERE numero = ?';
        db.query(checkQuery, [req.body.numero], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de la vérification du numéro." });
            }

            if (results[0].count > 0) {
                return res.status(400).json({ message: `Le numéro ${req.body.numero} existe déjà.` });
            }

            const insertQuery = 'INSERT INTO numero(`numero`) VALUES(?)';
            const values = [
                req.body.numero
            ];

            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'un nouveau numéro." });
                }

                return res.json('Processus réussi');
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'un nouveau numéro." });
    }
};
