const { db } = require("./../config/database");
const nodemailer = require('nodemailer');
const juice = require('juice');
const ejs = require('ejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();


exports.getOperationCount = (req, res) => {
    const { searchValue } = req.query;

    let q = `
        SELECT COUNT(id_operations) AS nbre_operation,
            (SELECT COUNT(id_operations) FROM operations WHERE operations.id_type_operations = 1) AS nbre_installation,
            (SELECT COUNT(id_operations) FROM operations WHERE operations.id_type_operations = 2) AS nbre_transfert,
            (SELECT COUNT(id_operations) FROM operations WHERE operations.id_type_operations = 3) AS nbre_dementelement,
            (SELECT COUNT(id_operations) FROM operations WHERE operations.id_type_operations = 4) AS nbre_controle_technique,
            (SELECT COUNT(id_operations) FROM operations WHERE operations.id_type_operations = 5) AS nbre_remplacement
        FROM operations 
        INNER JOIN client ON operations.id_client = client.id_client
        INNER JOIN type_operations ON operations.id_type_operations = type_operations.id_type_operations
        WHERE operations.est_supprime = 0
    `;
    const params = [];

    if (searchValue) {
        q += ` AND (client.nom_client LIKE ? OR type_operations.nom_type_operations LIKE ?)`;
        params.push(`%${searchValue}%`, `%${searchValue}%`);
    }

    db.query(q, params, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getOperationCountJour = (req, res) => {

    let q = `
        SELECT COUNT(id_operations) AS nbre_operation
        FROM operations 
        WHERE operations.est_supprime = 0 AND DATE(date_operation) = CURDATE()
    `;

    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getOperationCountHier = (req, res) => {

    let q = `
        SELECT COUNT(id_operations) AS nbre_operation
        FROM operations 
        WHERE operations.est_supprime = 0 AND DATE(date_operation) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    `;

    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getOperationCount7jours = (req, res) => {

    let q = `
        SELECT COUNT(id_operations) AS nbre_operation
        FROM operations 
        WHERE operations.est_supprime = 0 AND DATE(date_operation) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `;

    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getOperationCount30jours = (req, res) => {

    let q = `
        SELECT COUNT(id_operations) AS nbre_operation
        FROM operations 
        WHERE operations.est_supprime = 0 AND DATE(date_operation) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `;

    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getOperationCount1an = (req, res) => {

    let q = `
        SELECT COUNT(id_operations) AS nbre_operation
        FROM operations 
        WHERE operations.est_supprime = 0 AND DATE(date_operation) >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    `;

    db.query(q,(error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getOperation = (req, res) => {

    const { start_date, end_date, searchValue, id_operation } = req.query;

    const q = `
    SELECT 
        operations.*, 
        client.nom_client, 
        client.email,
        superviseur.username AS superviseur, 
        site.nom_site, 
        traceur.numero_serie, 
        traceur.code,
        type_operations.nom_type_operations AS type_operations, 
        technicien.username AS technicien,
        user_cr.username AS user_cr, numero.numero, vehicule.matricule, marque.nom_marque,
        DATE_FORMAT(CONVERT_TZ(operations.date_operation, '+00:00', @@session.time_zone), '%Y-%m-%d') AS date_operation
    FROM operations 
        INNER JOIN client ON operations.id_client = client.id_client
        INNER JOIN users AS superviseur ON operations.id_superviseur = superviseur.id
        INNER JOIN users AS technicien ON operations.id_technicien = technicien.id
        INNER JOIN users AS user_cr ON operations.user_cr = user_cr.id
        INNER JOIN site ON operations.site = site.id_site
        INNER JOIN traceur ON operations.id_traceur = traceur.id_traceur
        INNER JOIN type_operations ON operations.id_type_operations = type_operations.id_type_operations
        LEFT JOIN affectations ON traceur.id_traceur = affectations.id_traceur
        LEFT JOIN numero ON affectations.id_numero = numero.id_numero
        INNER JOIN vehicule ON operations.id_vehicule = vehicule.id_vehicule
        INNER JOIN marque ON vehicule.id_marque = marque.id_marque
    WHERE operations.est_supprime = 0
    ${start_date ? `AND DATE(operations.date_operation) >= '${start_date}'` : ''}
    ${end_date ? `AND DATE(operations.date_operation) <= '${end_date}'` : ''}
    ${id_operation ? `AND operations.id_operations = ?` : ''}
    GROUP BY operations.id_operations
    ORDER BY operations.created_at DESC;
    `;
    const params = id_operation ? [id_operation] : [];

    db.query(q, params, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postOperationRempl = async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "Aucun fichier téléchargé" });
    }

    const photoPlaqueFile = req.files['photo_plaque'][0]; 
    const photoTraceurFile = req.files['photo_traceur'][0];

    const photoPlaqueUrl = `/uploads/${photoPlaqueFile.filename}`;
    const photoTraceurUrl = `/uploads/${photoTraceurFile.filename}`;

    res.setHeader('Content-Type', 'multipart/form-data');

    try {
        const updateAff = `UPDATE affectations SET id_numero = ${req.body.id_numero_nouveau} WHERE id_numero = ?`
        const updateTraceur = 'UPDATE traceur SET id_numero = NULL WHERE id_numero = ?'
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
}

/* exports.postOperation = async (req, res) => {
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
 */


/* exports.postOperation = async (req, res) => {

    try {
        // Vérification des fichiers requis
        if (!req.files || !req.files['photo_plaque'] || !req.files['photo_traceur']) {
            return res.status(400).json({ error: "Les fichiers photo_plaque et photo_traceur sont requis." });
        }

        // Récupération des fichiers
        const photoPlaqueFile = req.files['photo_plaque'][0];
        const photoTraceurFile = req.files['photo_traceur'][0];

        // Création des URLs des fichiers
        const photoPlaqueUrl = `/uploads/${photoPlaqueFile.filename}`;
        const photoTraceurUrl = `/uploads/${photoTraceurFile.filename}`;

        // Requête d'insertion
        const insertQuery = `
            INSERT INTO operations (
                id_client, site, id_superviseur, id_technicien, date_operation, id_type_operations, id_vehicule,
                id_traceur, probleme, observation, kilometre, tension, photo_plaque, photo_traceur, user_cr
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.id_client,
            req.body.site,
            req.body.id_superviseur,
            req.body.id_technicien,
            req.body.date_operation,
            req.body.id_type_operations,
            req.body.id_vehicule,
            req.body.id_traceur,
            req.body.probleme,
            req.body.observation,
            req.body.kilometre,
            req.body.tension,
            photoPlaqueUrl,
            photoTraceurUrl,
            req.body.user_cr
        ];

        // Exécution de l'insertion
        await db.query(insertQuery, values);

        // Mise à jour de l'état du traceur en fonction du type d'opération
        let updateQuery;
        let updateValues;

        if (req.body.id_type_operations === '1') {  // Installation
            updateQuery = `
                UPDATE traceur 
                SET id_client = ?, id_etat_traceur = 7, id_vehicule = ?
                WHERE id_traceur = ?
            `;
            updateValues = [req.body.id_client, req.body.id_vehicule, req.body.id_traceur];
        } else if (req.body.id_type_operations === '3') {  // Démantèlement
            updateQuery = `
                UPDATE traceur 
                SET id_client = NULL, id_etat_traceur = 2, id_vehicule = NULL 
                WHERE id_traceur = ?
            `;
            updateValues = [req.body.id_traceur];
        }
        else if (req.body.id_type_operations === '2') {  // Transfert
            updateQuery = `
                UPDATE traceur 
                SET id_client = ?, id_etat_traceur = 7, id_vehicule = ? 
                WHERE id_traceur = ?
            `;
            updateValues = [req.body.id_client, req.body.id_vehicule, req.body.id_traceur];
        }

        if (updateQuery) {
            await db.query(updateQuery, updateValues);
        }

        // Réponse en cas de succès
        return res.json({ message: 'Processus réussi' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'opération." });
    }
}; */

exports.postOperation = async (req, res) => {
    try {
        // Vérification des fichiers requis
        if (!req.files || !req.files['photo_plaque'] || !req.files['photo_traceur']) {
            return res.status(400).json({ error: "Les fichiers photo_plaque et photo_traceur sont requis." });
        }

        // Récupération des fichiers
        const photoPlaqueFile = req.files['photo_plaque'][0];
        const photoTraceurFile = req.files['photo_traceur'][0];

        // Création des URLs des fichiers
        const photoPlaqueUrl = `/uploads/${photoPlaqueFile.filename}`;
        const photoTraceurUrl = `/uploads/${photoTraceurFile.filename}`;

        // Requête d'insertion
        const insertQuery = `
            INSERT INTO operations (
                id_client, site, id_superviseur, id_technicien, date_operation, id_type_operations, id_vehicule,
                id_traceur, nomenclature, probleme, observation, kilometre, tension, photo_plaque, photo_traceur, user_cr
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.id_client,
            req.body.site,
            req.body.id_superviseur,
            req.body.id_technicien,
            req.body.date_operation,
            req.body.id_type_operations,
            req.body.id_vehicule,
            req.body.id_traceur,
            req.body.nomenclature,
            req.body.probleme,
            req.body.observation,
            req.body.kilometre,
            req.body.tension,
            photoPlaqueUrl,
            photoTraceurUrl,
            req.body.user_cr
        ];

        // Exécution de l'insertion
        await db.query(insertQuery, values);

        // Mise à jour de l'état du traceur en fonction du type d'opération
        let updateQuery;
        let updateValues;

        if (req.body.id_type_operations === '1') {  // Installation
            updateQuery = `
                UPDATE traceur 
                SET id_client = ?, id_etat_traceur = 7, id_vehicule = ?
                WHERE id_traceur = ?
            `;
            updateValues = [req.body.id_client, req.body.id_vehicule, req.body.id_traceur];
        } else if (req.body.id_type_operations === '3') {  // Démantèlement
            updateQuery = `
                UPDATE traceur 
                SET id_client = NULL, id_etat_traceur = 2, id_vehicule = NULL 
                WHERE id_traceur = ?
            `;
            updateValues = [req.body.id_traceur];
        }
        else if (req.body.id_type_operations === '2') {  // Transfert
            updateQuery = `
                UPDATE traceur 
                SET id_client = ?, id_etat_traceur = 7, id_vehicule = ? 
                WHERE id_traceur = ?
            `;
            updateValues = [req.body.id_client, req.body.id_vehicule, req.body.id_traceur];
        }
        else if (req.body.id_type_operations === '5') {  // Remplacement

            if (req.body.traceur_echange && req.body.traceur_echange !== ''){
                updateQuery = `
                UPDATE traceur 
                SET id_traceur = ?, id_etat_traceur = ?, id_vehicule = ? 
                WHERE id_traceur = ?
                `;
                updateValues = [req.body.traceur_echange, req.body.id_etat_traceur, req.body.id_vehicule, req.body.id_traceur];
            }
        }

        // Exécution de la mise à jour si nécessaire
        if (updateQuery) {
            await db.query(updateQuery, updateValues);
        }

        // Réponse en cas de succès
        return res.json({ message: 'Processus réussi' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'opération." });
    }
};

//Site
exports.getSite = (req, res) => {
    const q = `
            SELECT site.*, client.nom_client
                FROM site
            INNER JOIN client ON site.id_client = client.id_client
            `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postSite = async (req, res) => {
    try {
        const q = 'INSERT INTO site(`nom_site`, `id_client`) VALUES(?,?)';
        const values = [
            req.body.nom_site,
            req.body.id_client
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du client." });
    }
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

exports.postSignature = async (req, res) => {
    try {
        const q = 'INSERT INTO signatures(`id_client`, `id_operation`, `signature`) VALUES(?,?,?)';
        const values = [
            req.body.id_client,
            req.body.id_operation,
            req.body.signature
        ];

        db.query(q, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'une signature." });
            }

            const signatureId = results.insertId;
            
            // Récupérez la signature insérée pour la renvoyer dans la réponse
            db.query('SELECT signature FROM signatures WHERE id_signature = ?', [signatureId], (selectError, selectResults) => {
                if (selectError) {
                    console.error(selectError);
                    return res.status(500).json({ error: "Erreur lors de la récupération de la signature." });
                }
                
                if (selectResults.length === 0) {
                    return res.status(404).json({ error: "Signature non trouvée." });
                }
                
                const signatureData = selectResults[0].signature;
                
                // Renvoyez la signature Base64 dans la réponse
                return res.json({ success: true, signature: signatureData });
            });

        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout d'une signature." });
    }
};

/* exports.envoieEmail = async (req, res) => {
    const { email, id_client } = req.body;

    const q = `
    SELECT 
        operations.*, 
        client.nom_client, 
        superviseur.username AS superviseur, 
        site.nom_site, 
        traceur.numero_serie, 
        type_operations.nom_type_operations AS type_operations, 
        technicien.username AS technicien,
        user_cr.username AS user_cr, numero.numero, vehicule.matricule, marque.nom_marque
    FROM operations 
        INNER JOIN client ON operations.id_client = client.id_client
        INNER JOIN users AS superviseur ON operations.id_superviseur = superviseur.id
        INNER JOIN users AS technicien ON operations.id_technicien = technicien.id
        INNER JOIN users AS user_cr ON operations.user_cr = user_cr.id
        INNER JOIN site ON operations.site = site.id_site
        INNER JOIN traceur ON operations.id_traceur = traceur.id_traceur
        INNER JOIN type_operations ON operations.id_type_operations = type_operations.id_type_operations
        INNER JOIN affectations ON traceur.id_traceur = affectations.id_traceur
        INNER JOIN numero ON affectations.id_numero = numero.id_numero
        INNER JOIN vehicule ON operations.id_vehicule = vehicule.id_vehicule
        INNER JOIN marque ON vehicule.id_marque = marque.id_marque
    WHERE operations.est_supprime = 0
    AND operations.id_operations = ?
    ORDER BY operations.date_operation DESC;
    `;
    const params = [id_client];

    try {
        // Récupérer les données de l'opération depuis la base de données
        const [operationsDetails] = await db.query(q, params);

        // Chemin vers le fichier template EJS
        const templatePath = path.join(__dirname, 'template.ejs');

        // Rendre le template EJS avec les données
        const htmlContent = await ejs.renderFile(templatePath, { operationsDetails });

        // Inline le CSS avec juice
        const inlinedHTML = juice(htmlContent);

        // Créer un transporteur SMTP réutilisable
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'votre_email@gmail.com', // Votre adresse e-mail Gmail
                pass: 'votre_mot_de_passe' // Votre mot de passe Gmail
            }
        });

        // Définir les options de l'e-mail
        let mailOptions = {
            from: 'votre_email@gmail.com',
            to: email,
            subject: 'Rapport des opérations',
            html: inlinedHTML
        };

        // Envoyer l'e-mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Erreur lors de l\'envoi de l\'e-mail:', error);
                res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de l\'envoi de l\'e-mail.' });
            } else {
                console.log('E-mail envoyé avec succès:', info.response);
                res.status(200).json({ success: true, message: 'E-mail envoyé avec succès.' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la récupération des données.' });
    }
} */

exports.envoieEmail = async (req, res) => {
    const { email, id_operations } = req.body;

    console.log(req.body)
  
    if (!Array.isArray(id_operations) || id_operations.length === 0) {
      return res.status(400).json({ error: "id_operations doit être un tableau non vide." });
    }
  
    const placeholders = id_operations.map(() => '?').join(',');
    const q = `
      SELECT 
          operations.*, 
          client.nom_client, 
          superviseur.username AS superviseur, 
          site.nom_site, 
          traceur.numero_serie, 
          traceur.code,
          type_operations.nom_type_operations AS type_operations, 
          technicien.username AS technicien,
          user_cr.username AS user_cr, numero.numero, vehicule.matricule, marque.nom_marque,
          DATE_FORMAT(CONVERT_TZ(operations.date_operation, '+00:00', @@session.time_zone), '%Y-%m-%d') AS date_operation,
          operations.photo_plaque,
          operations.photo_traceur
      FROM operations 
          INNER JOIN client ON operations.id_client = client.id_client
          INNER JOIN users AS superviseur ON operations.id_superviseur = superviseur.id
          INNER JOIN users AS technicien ON operations.id_technicien = technicien.id
          INNER JOIN users AS user_cr ON operations.user_cr = user_cr.id
          INNER JOIN site ON operations.site = site.id_site
          INNER JOIN traceur ON operations.id_traceur = traceur.id_traceur
          INNER JOIN type_operations ON operations.id_type_operations = type_operations.id_type_operations
          LEFT JOIN affectations ON traceur.id_traceur = affectations.id_traceur
          LEFT JOIN numero ON affectations.id_numero = numero.id_numero
          INNER JOIN vehicule ON operations.id_vehicule = vehicule.id_vehicule
          INNER JOIN marque ON vehicule.id_marque = marque.id_marque
      WHERE operations.est_supprime = 0
        AND operations.id_operations IN (${placeholders})
      ORDER BY operations.date_operation DESC;
    `;
  
    db.query(q, id_operations, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'exécution de la requête SQL." });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: "Aucune opération trouvée pour les identifiants donnés." });
          return;
        }
  
        const groupedByType = results.reduce((acc, result) => {
          const type = result.type_operations || 'Autres';
          if (!acc[type]) acc[type] = [];
          acc[type].push(result);
          return acc;
        }, {});
  
        let tableHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="border-bottom: 1px solid #cecece; width: 80%; margin: 10px 0;">
              <h2 style="padding: 10px 0; margin: 0; font-size: 1rem; color: red; text-align: center; line-height: 25px;">
                RAPPORT SYNTHETIQUE DES INSTALLATIONS ET CONTROLES TECHNIQUES DES TRACKERS EFFECTUEES
                EN DATE DU ${new Date().toLocaleDateString()} SUR LES VEHICULE(S) ${results[0].nom_client.toUpperCase()}
              </h2>
            </div>
          </div>
        `;
  
        Object.entries(groupedByType).forEach(([type, details], index) => {
          tableHTML += `
            <div>
              <h3 style="padding-top: 20px;">${index + 1}. ${type}</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 16px; text-align: left;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">Matricule</th>
                    <th style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">Marque</th>
                    <th style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">Tracker</th>
                    <th style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">Observation</th>
                  </tr>
                </thead>
                <tbody>
          `;
  
          details.forEach(detail => {
            tableHTML += `
              <tr>
                <td style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">${detail.matricule ?? 'N/A'}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">${detail.nom_marque ?? 'N/A'}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">${detail.code ?? 'N/A'}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; font-size: .8rem;">${detail.observation ?? 'N/A'}</td>
              </tr>
            `;
          });
  
          tableHTML += `
                </tbody>
              </table>
              <div style="width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; padding: 10px 0; border-bottom: 1px solid #dddddd;">
          `;
  
          tableHTML += `
              </div>
            </div>
          `;
        });
  
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ndoeboutique01@gmail.com',
              pass: 'c c h d b z j i s p w n u w g z',
            },
          });
  
        const mailOptions = {
            from: 'ndoeboutique01@gmail.com',
            to: email,
            subject: "Rapport d'installation",
            html: tableHTML,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi de l'e-mail." });
          } else {
            console.log('E-mail envoyé :', info.response);
            res.status(200).json({ message: 'E-mail envoyé avec succès.' });
          }
        });
      }
    });
  };