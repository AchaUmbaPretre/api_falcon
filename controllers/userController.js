const { db } = require('./../config/database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

/* exports.registerController = async (req, res) => {
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
 */

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

      const defaultPassword = password || '1234';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

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

exports.getPersonnel = async (req, res) => {
  const query = 'SELECT * FROM users';

  db.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  });
};

exports.getPersonnelOne = async (req, res) => {
  const { userId } = req.query;
  const query = 'SELECT users.username, users.id, users.email, users.telephone, role FROM users WHERE id = ?';

  db.query(query,[userId], (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  });
};

exports.putPersonnel = async (req, res) => {
  const { userId } = req.query;

  const {username, email, telephone, role} = req.body;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid utilisateur ID provided' });
  }

  try {

    const q = `
        UPDATE users 
        SET 
            username = ?,
            email = ?,
            telephone = ?,
            role = ?
        WHERE id = ?
    `;
  
    const values = [username, email, telephone, role, userId];

    const result = await db.query(q, values);

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User record not found' });
    }

    return res.json({ message: 'User record updated successfully' });
} catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: 'Failed to update user record' });
}

};

exports.detailForgot = (req, res) => {
  const { email } = req.query;
  const q = `SELECT users.username, users.id, users.email FROM users WHERE email = ?`

  db.query(q,[email], (error, data) => {
    if(error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  });
};

exports.updateUser = async (req, res) => {
  const id = req.params.id
  const { password } = req.query;

  if (!id || !password) {
      return res.status(400).json({ error: "ID and password are required" });
  }

  try {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const q = `UPDATE users SET password = ? WHERE id = ?`;

      db.query(q, [hashedPassword, id], (error, data) => {
          if (error) {
              return res.status(500).json({ error: error.message });
          }
          if (data.affectedRows === 0) {
              return res.status(404).json({ error: "User not found" });
          }
          res.status(200).json({ message: "Password updated successfully" });
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};