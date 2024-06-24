const { db } = require("./../config/database");

exports.getFacture = (req, res) => {
    const q = `
    SELECT factures.date_facture, factures.total, factures.statut, client.nom_client, facture_details.quantite, facture_details.prix_unitaire, facture_details.montant, remises.description, taxes.description AS taxes_description FROM factures
        INNER JOIN client ON factures.id_client = client.id_client
        INNER JOIN facture_details ON factures.id_facture = facture_details.id_facture
        LEFT JOIN remises ON facture_details.id_remise = remises.id_remise
        LEFT JOIN taxes ON facture_details.id_taxe = taxes.id_taxes
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

/* exports.postFacture = (req, res) => {
    const { id_client, date_facture, details } = req.body;

    let total = 0;

    details.forEach(detail => {
        total += detail.prix_unitaire * detail.quantite;
    });

    db.query('INSERT INTO factures (id_client, date_facture, total) VALUES (?, ?, ?)', [id_client, date_facture, total], (err, result) => {
        if (err) throw err;

        const id_facture = result.insertId;
        details.forEach(detail => {
            db.query('INSERT INTO facture_details (id_facture, quantite, prix_unitaire, montant, id_remise, id_taxe) VALUES (?, ?, ?, ?, ?, ?)', 
                [id_facture, detail.quantite, detail.prix_unitaire, detail.quantite * detail.prix_unitaire, detail.id_remise, detail.id_taxe], (err) => {
                    if (err) throw err;
                });
        });

        res.send({ id_facture });
    });
} */

/* exports.postFacture = (req, res) => {
    const { id_client, date_facture, details } = req.body;

    let totalSansTaxe = 0;
    let totalAvecTaxe = 0;

    details.forEach(detail => {
        let montantDetail = detail.prix_unitaire * detail.quantite;

        if (detail.id_remise) {
            db.query('SELECT montant FROM remises WHERE id_remise = ?', [detail.id_remise], (err, result) => {
                if (err) throw err;
                const remiseMontant = result[0].montant;
                montantDetail -= remiseMontant; // Soustraire le montant de la remise
                totalSansTaxe += montantDetail; // Ajouter le montant total du produit (sans taxe) au totalSansTaxe

                // Une fois que toutes les remises sont appliquées, calculer le total avec taxe
                calculerTotalAvecTaxe();
            });
        } else {
            totalSansTaxe += montantDetail; // Ajouter le montant total du produit (sans taxe) au totalSansTaxe
        }
    });

    // Fonction pour calculer le total avec taxe une fois que toutes les remises sont appliquées
    function calculerTotalAvecTaxe() {
        totalAvecTaxe = totalSansTaxe; 

        // Calculer le total avec taxe si une taxe est définie pour chaque produit
        details.forEach(detail => {
            let montantDetail = detail.prix_unitaire * detail.quantite;

            if (detail.taxe_id) {
                db.query('SELECT taux FROM taxes WHERE id_taxes = ?', [detail.id_taxe], (err, result) => {
                    if (err) throw err;
                    const tauxTaxe = result[0].taux;
                    const montantTaxe = (montantDetail * tauxTaxe) / 100;
                    montantDetail += montantTaxe; // Ajouter le montant de la taxe au montant total du produit
                    totalAvecTaxe += montantTaxe; // Ajouter le montant de la taxe au totalAvecTaxe
                });
            }
        });

        insererFactureEtDetails();
    }

    function insererFactureEtDetails() {
        // Insertion de la facture dans la base de données
        db.query('INSERT INTO factures (id_client, date_facture, total) VALUES (?, ?, ?)', [id_client, date_facture, totalAvecTaxe], (err, result) => {
            if (err) throw err;

            const id_facture = result.insertId;

            // Insertion des détails de facture dans la base de données
            details.forEach(detail => {
                db.query('INSERT INTO facture_details (id_facture, quantite, prix_unitaire, montant, id_remise, id_taxe) VALUES (?, ?, ?, ?, ?, ?)', 
                    [id_facture, detail.quantite, detail.prix_unitaire, detail.quantite * detail.prix_unitaire, detail.id_remise, detail.id_taxe], (err) => {
                        if (err) throw err;
                    });
            });

            res.send({ id_facture });
        });
    }

    // Si aucun détail à traiter, insérer directement la facture sans taxe ni remise
    if (details.length === 0) {
        insererFactureEtDetails();
    }
} */

exports.postFacture = (req, res) => {
    const { id_client, date_facture, details } = req.body;

    let totalSansTaxe = 0;
    let totalAvecTaxe = 0;

    details.forEach(detail => {
        let montantDetail = detail.prix_unitaire * detail.quantite;

        if (detail.id_remise) {

            db.query('SELECT montant FROM remises WHERE id_remise = ?', [detail.id_remise], (err, result) => {
                if (err) throw err;
                const remiseMontant = result[0].montant;
                montantDetail -= remiseMontant;
            });
        }

        totalSansTaxe += montantDetail;
    });


    details.forEach(detail => {
        let montantDetail = detail.prix_unitaire * detail.quantite;

        if (detail.id_taxe) {
            db.query('SELECT taux FROM taxes WHERE id_taxes = ?', [detail.id_taxe], (err, result) => {
                if (err) throw err;
                const tauxTaxe = result[0].taux;
                const montantTaxe = (montantDetail * tauxTaxe) / 100;
                montantDetail += montantTaxe;
            });
        }

        totalAvecTaxe += montantDetail;
    });

    db.query('INSERT INTO factures (id_client, date_facture, total) VALUES (?, ?, ?)', [id_client, date_facture, totalAvecTaxe], (err, result) => {
        if (err) throw err;

        const id_facture = result.insertId;

        details.forEach(detail => {
            db.query('INSERT INTO facture_details (id_facture,quantite, prix_unitaire, montant, id_remise, id_taxe) VALUES (?, ?, ?, ?, ?, ?)', 
                [id_facture, detail.quantite, detail.prix_unitaire, detail.quantite * detail.prix_unitaire, detail.id_remise, detail.id_taxe], (err) => {
                    if (err) throw err;
                });
        });

        res.send({ id_facture });
    });
}


exports.getTaxes = (req, res) => {
    const q = `
    SELECT * FROM taxes
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.getRemises = (req, res) => {
    const q = `
    SELECT * FROM remises
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postPaiementPaye = (req, res) => {
    const { id_facture, montant, date_paiement } = req.body;
    db.query('INSERT INTO paiements (id_facture, montant, date_paiement) VALUES (?, ?, ?)', [id_facture, montant, date_paiement], (err, result) => {
        if (err) throw err;

        db.query('SELECT SUM(montant) AS total_paye FROM paiements WHERE id_facture = ?', [id_facture], (err, results) => {
            if (err) throw err;
            const total_paye = results[0].total_paye;

            db.query('SELECT total FROM factures WHERE id_facture = ?', [id_facture], (err, results) => {
                if (err) throw err;
                const total_facture = results[0].total;

                let statut = 'non payé';
                if (total_paye >= total_facture) {
                    statut = 'payé';
                } else if (total_paye > 0) {
                    statut = 'partiellement payé';
                }

                db.query('UPDATE factures SET statut = ? WHERE id_facture = ?', [statut, id_facture], (err) => {
                    if (err) throw err;
                    res.send({ statut });
                });
            });
        });
    });
}