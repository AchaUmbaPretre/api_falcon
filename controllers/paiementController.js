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
        SELECT 
            paiement.id_paiement,
            paiement.montant, 
            paiement.montant_tva, 
            paiement.date_paiement, 
            paiement.ref, 
            paiement.code_paiement, 
            paiement.document, 
            paiement.status, 
            client.nom_client, 
            methode_paiement.nom_methode, 
            users.username
        FROM 
            paiement
            LEFT JOIN client ON paiement.id_client = client.id_client
            LEFT JOIN methode_paiement ON paiement.methode = methode_paiement.id_methode 
            INNER JOIN users ON paiement.user_paiement = users.id
    `;
     
    db.query(q, (error, data) => {
        if (error) {
            console.error("Erreur lors de l'exécution de la requête :", error);
            return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des paiements." });
        }
        return res.status(200).json(data);
    });
}

exports.getPaiementOne = (req, res) => {
    const { id_paiement } = req.query;

    const q = `
        SELECT 
            paiement.id_paiement,
            paiement.montant, 
            paiement.montant_tva, 
            paiement.date_paiement, 
            paiement.ref, 
            paiement.code_paiement, 
            paiement.document, 
            paiement.status, 
            client.nom_client, 
            methode_paiement.nom_methode, 
            users.username
        FROM 
            paiement
            INNER JOIN client ON paiement.id_client = client.id_client
            INNER JOIN methode_paiement ON paiement.methode = methode_paiement.id_methode 
            INNER JOIN users ON paiement.user_paiement = users.id
        WHERE id_paiement = ?
    `;
     
    db.query(q,[id_paiement], (error, data) => {
        if (error) {
            console.error("Erreur lors de l'exécution de la requête :", error);
            return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des paiements." });
        }
        return res.status(200).json(data);
    });
}

exports.postPaiement = async (req, res) => {
    const photoFile = req.file;
    const photoUrl = `/uploads/${photoFile?.filename}`;

    try {
        if (!req.body.id_client || !req.body.methode || !req.body.user_paiement ) {
            return res.status(400).json({ error: "Certains champs requis sont manquants dans la requête." });
        }

        const id_client = req.body.id_client;
        if (typeof id_client === 'undefined' || id_client === null) {
            return res.status(400).json({ error: "L'ID client est manquant ou invalide." });
        }

        const montant = parseFloat(req.body.montant);
        const tauxTVA = 16;
        const montantTVA = montant * (tauxTVA / 100);

        const montantTotal = montant + montantTVA;

        const qInsert = 'INSERT INTO paiement (`id_client`, `montant`, `montant_tva`, `device`, `methode`, `user_paiement`, `ref`, `code_paiement`, `document`) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)';

        const values = [
            id_client,
            montant,
            montantTotal,
            req.body.device,
            req.body.methode,
            req.body.user_paiement,
            req.body.code_paiement,
            photoUrl
        ];

        db.query(qInsert, values, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion du paiement:', err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du paiement." });
            }
            
            const insertId = result && result.insertId;

            if (!insertId) {
                console.error('Insertion failed:', result);
                return res.status(500).json({ error: "L'insertion du paiement a échoué." });
            }

            const annee = new Date().getFullYear().toString().slice(-2); // Les deux derniers chiffres de l'année
            const id_client_formatted = id_client.toString().padStart(2, '0'); // Formater sur deux chiffres
            const id_paiement_formatted = insertId.toString().padStart(2, '0'); // Formater sur deux chiffres
            const ref = `${annee}${id_client_formatted}${id_paiement_formatted}`;

            const qUpdate = 'UPDATE paiement SET `ref` = ? WHERE `id_paiement` = ?';
            db.query(qUpdate, [ref, insertId], (err, result) => {
                if (err) {
                    console.error('Erreur lors de la mise à jour de la référence:', err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de la référence." });
                }
                console.log('Mise à jour réussie avec la référence:', ref);
                return res.json('Processus réussi');
            });
        });
    } catch (error) {
        console.error('Erreur lors de l\'insertion du paiement:', error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du paiement." });
    }
};

/* exports.postPaiementOk = async (req, res) => {
    const photoFile = req.file;
    const photoUrl = `/uploads/${photoFile?.filename}`;
    const { id_facture, id_client, montant, montant_tva, device, date_paiement, methode, user_paiement } = req.body;
    
    const qInsert = 'INSERT INTO paiement (`id_facture`, `id_client`, `montant`, `montant_tva`, `device`, `date_paiement`, `methode`, `user_paiement`, `code_paiement`, `document`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const qUpdate = 'UPDATE paiement SET `ref` = ? WHERE `id_paiement` = ?';
    const qSelectTotalPaye = 'SELECT SUM(montant) AS total_paye FROM paiement WHERE id_facture = ?';
    const qSelectFactureTotal = 'SELECT total FROM factures WHERE id_facture = ?';
    const qUpdateStatus = 'UPDATE factures SET `statut` = ? WHERE `id_facture` = ?';

    try {
        // Vérifier le total déjà payé pour cette facture
        db.query(qSelectTotalPaye, [id_facture], (err, results) => {
            if (err) {
                console.error('Erreur lors de la sélection du total payé:', err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du total payé." });
            }
            const total_paye = results[0]?.total_paye || 0;

            // Vérifier le total de la facture
            db.query(qSelectFactureTotal, [id_facture], (err, results) => {
                if (err) {
                    console.error('Erreur lors de la sélection du total de la facture:', err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du total de la facture." });
                }
                const total_facture = montant || 0;

                // Vérifier si le montant total a déjà été payé
                if (montant >= total_facture) {
                    return res.status(400).json({ error: "Le montant total de la facture a déjà été payé." });
                }

                // Si le paiement est possible, procéder à l'insertion
                const values = [
                    id_facture,
                    id_client,
                    montant,
                    montant_tva,
                    device,
                    date_paiement,
                    methode,
                    user_paiement,
                    null,  // code_paiement sera mis à jour après l'insertion
                    photoUrl
                ];

                db.query(qInsert, values, (err, result) => {
                    if (err) {
                        console.error('Erreur lors de l\'insertion du paiement:', err);
                        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du paiement." });
                    }

                    const insertId = result.insertId;
                    const annee = new Date().getFullYear().toString().slice(-2);
                    const id_client_formatted = id_client.toString().padStart(2, '0');
                    const id_paiement_formatted = insertId.toString().padStart(2, '0');
                    const formattedRef = `${annee}${id_client_formatted}${id_paiement_formatted}`;

                    // Générer le code_paiement avec un nombre aléatoire à 6 chiffres
                    const code_paiement = Math.floor(100000 + Math.random() * 900000).toString();

                    // Mettre à jour la référence et le code_paiement
                    db.query(qUpdate, [formattedRef, insertId], (err) => {
                        if (err) {
                            console.error('Erreur lors de la mise à jour de la référence:', err);
                            return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de la référence." });
                        }

                        const qUpdateCodePaiement = 'UPDATE paiement SET `code_paiement` = ? WHERE `id_paiement` = ?';
                        db.query(qUpdateCodePaiement, [code_paiement, insertId], (err) => {
                            if (err) {
                                console.error('Erreur lors de la mise à jour du code de paiement:', err);
                                return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du code de paiement." });
                            }

                            // Mettre à jour le statut de la facture
                            const statut = (montant >= total_facture) ? 'payé' : 'partiellement payé';
                            db.query(qUpdateStatus, [statut, id_facture], (err) => {
                                if (err) {
                                    console.error('Erreur lors de la mise à jour du statut de la facture:', err);
                                    return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du statut de la facture." });
                                }
                                res.json({ statut, code_paiement });
                            });
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Une erreur s\'est produite:', err);
        res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande." });
    }
}; */


/* exports.postPaiementOk = async (req, res) => {
    const photoFile = req.file;
    const photoUrl = `/uploads/${photoFile?.filename}`;
    const { id_facture, id_client, montant, montant_tva, device, date_paiement, methode, user_paiement } = req.body;
    
    const qInsert = 'INSERT INTO paiement (`id_facture`, `id_client`, `montant`, `montant_tva`, `device`, `date_paiement`, `methode`, `user_paiement`, `code_paiement`, `document`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const qUpdate = 'UPDATE paiement SET `ref` = ? WHERE `id_paiement` = ?';
    const qSelectFactureStatus = 'SELECT statut FROM factures WHERE id_facture = ?';
    const qSelectTotalPaye = 'SELECT SUM(montant) AS total_paye FROM paiement WHERE id_facture = ?';
    const qSelectFactureTotal = 'SELECT total FROM factures WHERE id_facture = ?';
    const qUpdateStatus = 'UPDATE factures SET `statut` = ? WHERE `id_facture` = ?';

    try {
        // Vérifier le statut actuel de la facture
        db.query(qSelectFactureStatus, [id_facture], (err, results) => {
            if (err) {
                console.error('Erreur lors de la sélection du statut de la facture:', err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du statut de la facture." });
            }
            const statut_facture = results[0]?.statut;

            // Si la facture est déjà payée, renvoyer un message d'erreur
            if (statut_facture === 'payé') {
                return res.status(400).json({ error: "La facture a déjà été entièrement payée." });
            }

            // Vérifier le total déjà payé pour cette facture
            db.query(qSelectTotalPaye, [id_facture], (err, results) => {
                if (err) {
                    console.error('Erreur lors de la sélection du total payé:', err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du total payé." });
                }
                const total_paye = results[0]?.total_paye || 0;

                // Vérifier le total de la facture
                db.query(qSelectFactureTotal, [id_facture], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de la sélection du total de la facture:', err);
                        return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du total de la facture." });
                    }
                    const total_facture = results[0]?.total || 0;

                    // Vérifier si le montant total a déjà été payé
                    if (total_paye + montant >= total_facture) {
                        // Mettre à jour le statut de la facture à 'payé'
                        db.query(qUpdateStatus, ['payé', id_facture], (err) => {
                            if (err) {
                                console.error('Erreur lors de la mise à jour du statut de la facture:', err);
                                return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du statut de la facture." });
                            }
                            return res.status(400).json({ error: "Le montant total de la facture a déjà été payé." });
                        });
                    } else {
                        // Si le paiement est possible, procéder à l'insertion
                        const values = [
                            id_facture,
                            id_client,
                            montant,
                            montant_tva,
                            device,
                            date_paiement,
                            methode,
                            user_paiement,
                            null,  // code_paiement sera mis à jour après l'insertion
                            photoUrl
                        ];

                        db.query(qInsert, values, (err, result) => {
                            if (err) {
                                console.error('Erreur lors de l\'insertion du paiement:', err);
                                return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du paiement." });
                            }

                            const insertId = result.insertId;
                            const annee = new Date().getFullYear().toString().slice(-2);
                            const id_client_formatted = id_client.toString().padStart(2, '0');
                            const id_paiement_formatted = insertId.toString().padStart(2, '0');
                            const formattedRef = `${annee}${id_client_formatted}${id_paiement_formatted}`;

                            // Générer le code_paiement avec un nombre aléatoire à 6 chiffres
                            const code_paiement = Math.floor(100000 + Math.random() * 900000).toString();

                            // Mettre à jour la référence et le code_paiement
                            db.query(qUpdate, [formattedRef, insertId], (err) => {
                                if (err) {
                                    console.error('Erreur lors de la mise à jour de la référence:', err);
                                    return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de la référence." });
                                }

                                const qUpdateCodePaiement = 'UPDATE paiement SET `code_paiement` = ? WHERE `id_paiement` = ?';
                                db.query(qUpdateCodePaiement, [code_paiement, insertId], (err) => {
                                    if (err) {
                                        console.error('Erreur lors de la mise à jour du code de paiement:', err);
                                        return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du code de paiement." });
                                    }

                                    // Mettre à jour le statut de la facture si nécessaire
                                    const statut = (total_paye + montant >= total_facture) ? 'payé' : 'partiellement payé';
                                    db.query(qUpdateStatus, [statut, id_facture], (err) => {
                                        if (err) {
                                            console.error('Erreur lors de la mise à jour du statut de la facture:', err);
                                            return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du statut de la facture." });
                                        }
                                        res.json({ statut, code_paiement });
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
    } catch (err) {
        console.error('Une erreur s\'est produite:', err);
        res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande." });
    }
}; */

exports.postPaiementOk = async (req, res) => {
    const photoFile = req.file;
    const photoUrl = `/uploads/${photoFile?.filename}`;
    const { id_facture, id_client, montant, montant_tva, device, date_paiement, methode, user_paiement } = req.body;
    
    const qInsert = 'INSERT INTO paiement (`id_facture`, `id_client`, `montant`, `montant_tva`, `device`, `date_paiement`, `methode`, `user_paiement`, `code_paiement`, `document`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const qUpdate = 'UPDATE paiement SET `ref` = ? WHERE `id_paiement` = ?';
    const qSelectFactureStatus = 'SELECT statut FROM factures WHERE id_facture = ?';
    const qSelectTotalPaye = 'SELECT SUM(montant) AS total_paye FROM paiement WHERE id_facture = ?';
    const qSelectFactureTotal = 'SELECT total FROM factures WHERE id_facture = ?';
    const qUpdateStatus = 'UPDATE factures SET `statut` = ? WHERE `id_facture` = ?';

    try {
        db.query(qSelectFactureStatus, [id_facture], (err, results) => {
            if(err) {
                console.error('Erreur lors de la sélection du statut de la facture:', err);
                return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du statut de la facture." });
            }
            const statut_facture = results[0]?.statut;
            console.log(statut_facture)
            if (statut_facture === 'payé') {
                return res.status(400).json({ error: "La facture a déjà été entièrement payée." });
            }

            db.query(qSelectTotalPaye, [id_facture], (err, results) =>{
                if(err) {
                    console.error('Erreur lors de la sélection du total payé:', err);
                    return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du total payé." });
                }
                const total_paye = results[0]?.total_paye || 0;
                
                db.query(qSelectFactureTotal, [id_facture], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de la sélection du total de la facture:', err);
                        return res.status(500).json({ error: "Une erreur s'est produite lors de la sélection du total de la facture." });
                    }
                    const total_facture = results[0]?.total || 0;

                    if(total_paye + montant >= total_facture) {
                        db.query(qUpdateStatus, ['payé', id_facture], (err) => {
                            if (err) {
                                console.error('Erreur lors de la mise à jour du statut de la facture:', err);
                                return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du statut de la facture." });
                            }
                            return res.status(400).json({ error: "Le montant total de la facture a déjà été payé." });
                        })
                    } else {
                        const values = [
                            id_facture,
                            id_client,
                            montant,
                            montant_tva,
                            device,
                            date_paiement,
                            methode,
                            user_paiement,
                            null,  // code_paiement sera mis à jour après l'insertion
                            photoUrl
                        ];

                        db.query(qInsert, values, (err, result) => {
                            if (err) {
                                console.error('Erreur lors de l\'insertion du paiement:', err);
                                return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du paiement." });
                            }

                            const insertId = result.insertId;
                            const annee = new Date().getFullYear().toString().slice(-2);
                            const id_client_formatted = id_client.toString().padStart(2, '0');
                            const id_paiement_formatted = insertId.toString().padStart(2, '0');
                            const formattedRef = `${annee}${id_client_formatted}${id_paiement_formatted}`;

                            // Générer le code_paiement avec un nombre aléatoire à 6 chiffres
                            const code_paiement = Math.floor(100000 + Math.random() * 900000).toString();
                            db.query(qUpdate, [formattedRef, insertId], (err) => {
                                if (err) {
                                    console.error('Erreur lors de la mise à jour de la référence:', err);
                                    return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de la référence." });
                                }

                                const qUpdateCodePaiement = 'UPDATE paiement SET `code_paiement` = ? WHERE `id_paiement` = ?';
                                db.query(qUpdateCodePaiement, [code_paiement, insertId], (err) => {
                                    if (err) {
                                        console.error('Erreur lors de la mise à jour du code de paiement:', err);
                                        return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du code de paiement." });
                                    }

                                    const statut = (total_paye + montant >= total_facture) ? 'payé' : 'partiellement payé';
                                    db.query(qUpdateStatus, [statut, id_facture], (err) => {
                                        if (err) {
                                            console.error('Erreur lors de la mise à jour du statut de la facture:', err);
                                            return res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du statut de la facture." });
                                        }

                                        res.json({ statut, code_paiement });
                                    })
                                })
                            })

                        })
                    }
                })
            })
        })
    } catch (error) {
        console.error('Une erreur s\'est produite:', err);
        res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande." });
    }
};







exports.getPaiementMois = (req, res) => {
    const {months} = req.query;
  
      const q = `SELECT MONTH(date_paiement) AS mois, SUM(montant) AS total_paiement
      FROM paiement WHERE est_supprime = 0
      ${months ? `AND YEAR(date_paiement) = '${months}'` : ''}
      GROUP BY mois`;
    
      db.query(q ,(error, data)=>{
        if(error) res.status(500).send(error)
    
        return res.status(200).json(data);
    })
    }

exports.getPaiementTout = (req, res) => {
      
          const q = `SELECT MONTH(date_paiement) AS mois, SUM(montant) AS total_paiement
          FROM paiement WHERE est_supprime = 0`;
        
          db.query(q ,(error, data)=>{
            if(error) res.status(500).send(error)
        
            return res.status(200).json(data);
        })
 }

exports.deletePaiement = (req, res) => {
    const id = req.params.id;

    const q = "DELETE FROM paiement WHERE id_paiement = ?";

    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'Paiement supprimé avec succès.', data });
    });
};



//Dette
exports.getDette = (req, res) => {
    const q = `
    SELECT *
        FROM dette
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}

exports.postDette = async (req, res) => {

    try {
        const q = 'INSERT INTO dette(`id_client`, `montant`, `montant_paye`) VALUES(?, ?, ?)';

        const values = [
            req.body.id_client,
            req.body.montant,
            req.body.montant_paye
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du vehicule." });
    }
}