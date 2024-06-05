const { db } = require("./../config/database");

exports.getAffectations = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { startDate, endDate, search } = req.query;

    let whereClause = 'WHERE affectations.est_supprime = 0';
    if (startDate && endDate) {
        whereClause += ` AND affectations.date BETWEEN '${startDate}' AND '${endDate}'`;
    }
    if (search) {
        whereClause += ` AND (numero.numero LIKE '%${search}%' OR traceur.model LIKE '%${search}%')`;
    }

    const q = `
        SELECT affectations.*, numero.numero, traceur.model, traceur.numero_serie
        FROM affectations 
        INNER JOIN numero ON affectations.id_numero = numero.id_numero
        INNER JOIN traceur ON affectations.id_traceur = traceur.id_traceur
        ${whereClause}
        LIMIT ${limit} OFFSET ${offset}
    `;
    
    const countQuery = `
        SELECT COUNT(*) as total
        FROM affectations 
        INNER JOIN numero ON affectations.id_numero = numero.id_numero
        INNER JOIN traceur ON affectations.id_traceur = traceur.id_traceur
        ${whereClause}
    `;

    db.query(q, (error, data) => {
        if (error) return res.status(500).send(error);

        db.query(countQuery, (countError, countData) => {
            if (countError) return res.status(500).send(countError);

            const total = countData[0].total;
            return res.status(200).json({
                data,
                currentPage: page,
                pageSize: limit,
                total
            });
        });
    });
};


exports.postAffectations = async (req, res) => {
    try {
        const affectations = req.body.affectations;
        const errors = [];

        for (const affectation of affectations) {
            const { id_numero, id_traceur } = affectation;

            
            const checkTraceurQuery = 'SELECT COUNT(*) AS count FROM affectations WHERE id_traceur = ?';
            const traceurResults = await new Promise((resolve, reject) => {
                db.query(checkTraceurQuery, [id_traceur], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            if (traceurResults[0].count > 0) {
                errors.push(`Le traceur numéro ${id_traceur} est déjà associé à un numéro.`);
                continue;
            }

            
            const checkNumeroQuery = 'SELECT COUNT(*) AS count FROM affectations WHERE id_numero = ?';
            const numeroResults = await new Promise((resolve, reject) => {
                db.query(checkNumeroQuery, [id_numero], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            if (numeroResults[0].count > 0) {
                errors.push(`Le numéro ${id_numero} est déjà associé à un traceur.`);
                continue;
            }

            
            const insertQuery = 'INSERT INTO affectations(`id_numero`, `id_traceur`) VALUES(?,?)';
            try {
                await new Promise((resolve, reject) => {
                    db.query(insertQuery, [id_numero, id_traceur], (err, results) => {
                        if (err) reject(err);
                        resolve(results);
                    });
                });
            } catch (err) {
                console.error(err);
                errors.push(`Une erreur s'est produite lors de l'ajout de l'affectation pour numéro ${id_numero} et traceur ${id_traceur}.`);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Certaines affectations ont échoué.', errors });
        }

        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout des affectations." });
    }
};




//Numero

exports.getNumeroCount = (req, res) => {
    const q = `
    SELECT COUNT(id_numero) AS nbre_numero
        FROM numero
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

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
        const numeros = req.body.numeros; 

        if (!Array.isArray(numeros) || numeros.length === 0) {
            return res.status(400).json({ message: "Veuillez fournir une liste de numéros." });
        }

        const placeholders = numeros.map(() => '?').join(', ');
        const checkQuery = `SELECT numero FROM numero WHERE numero IN (${placeholders})`;
        
        db.query(checkQuery, numeros, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de la vérification des numéros." });
            }

            const existingNumeros = results.map(row => row.numero);
            const newNumeros = numeros.filter(numero => !existingNumeros.includes(numero));

            if (newNumeros.length === 0) {
                return res.status(400).json({ message: "Tous les numéros fournis existent déjà." });
            }

            const insertQuery = 'INSERT INTO numero(`numero`) VALUES ' + newNumeros.map(() => '(?)').join(', ');
            const values = newNumeros;

            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout des nouveaux numéros." });
                }

                return res.json('Processus réussi');
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout des nouveaux numéros." });
    }
};

