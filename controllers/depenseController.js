const { db } = require("./../config/database");

exports.getDepense = (req, res) => {
    const q = `
    SELECT *
        FROM depense 
    WHERE est_supprime = 0
    `;
     
    db.query(q, (error, data) => {
        if (error) res.status(500).send(error);
        return res.status(200).json(data);
    });
}


exports.postDepense = async (req, res) => {
    try {
        const q = 'INSERT INTO depense(`id_users`, `categorie`, `montant`, `description`) VALUES(?,?,?,?)';
        const values = [
            req.body.id_users,
            req.body.categorie,
            req.body.montant,
            req.body.description
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du client." });
    }
}


exports.deleteDepense = (req, res) => {
    const id = req.params.id;
  
    const q = "DELETE depense WHERE id_depense = ?";
  
    db.query(q, [id], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  
  }