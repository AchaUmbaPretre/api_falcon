const { db } = require('./../config/database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

exports.registerController = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const values = [email];

    db.query(query, values, async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        return res.status(200).json({ message: 'Utilisateur existe déjà', success: false });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
      const insertValues = [username, email, hashedPassword, role];

      db.query(insertQuery, insertValues, (err, insertResult) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ message: 'Enregistré avec succès', success: true });
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Erreur dans le contrôleur de registre : ${err.message}`,
    });
  }
};

exports.loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const values = [username];

    db.query(query, values, async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const user = results[0];

      if (!user) {
        return res.status(200).json({ message: 'Utilisateur non trouvé', success: false });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(200).json({ message: 'Email ou mot de passe invalide', success: false });
      }

      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT,
        { expiresIn: '3d' }
      );

      const { password: userPassword, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Connexion réussie',
        success: true,
        ...userWithoutPassword,
        accessToken,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('access_token', {
    sameSite: 'None',
    secure: true,
  });

  res.status(200).json({ message: 'Utilisateur déconnecté avec succès' });
};

exports.getPersonnel = (req, res) => {
  const query = 'SELECT * FROM users';

  db.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  });
};
