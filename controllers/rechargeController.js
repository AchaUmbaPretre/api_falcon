const { db } = require("./../config/database");

exports.getRecharge = (req, res) => {
    const query = 'SELECT * FROM recharge';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des permissions:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
        }
        res.json(results);
    });
};

exports.postRecharge = async (req, res) => {

    try {
        const q = 'INSERT INTO recharge(`id_client`,`id_numero`) VALUES(?,?)';
        const values = [
            req.body.id_client,
            req.body.id_numero
        ];

        await db.query(q, values);
        return res.json('Processus réussi');
    } catch (error) {
        console.error(error);
        console.log(error)
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du contact." });
    }
}

exports.deleteRecharge = (req, res) => {
    const id_recharge = req.params.id;
  
    const q = "DELETE recharge WHERE id_recharge = ?";
  
    db.query(q, [id_recharge], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  
  }