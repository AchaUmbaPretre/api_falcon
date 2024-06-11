const { db } = require("./../config/database");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')

dotenv.config();


const userService = {

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM users';
          db.query(query, (error, results) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(results);
          });
        });
    },

    createUser: async (userData) => {

        const existingUserQuery = 'SELECT * FROM users WHERE email = ?';
        const values = [userData.email];
        const existingUser = await db.query(existingUserQuery, values);
      
        if (existingUser.length > 0) {
          throw new Error("L'utilisateur existe déjà");
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const insertQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(insertQuery, [userData.username, userData.email, hashedPassword]);
        const userId = result.insertId;
      
        return userId;
      },
  
    loginUser: async (email, password) => {
      
      const userQuery = 'SELECT * FROM users WHERE email = ?';
      const [user] = await db.query(userQuery, [email]);
      if (user.length === 0) {
        throw new Error('L\'utilisateur n\'existe pas');
      }
  
      const match = await bcrypt.compare(password, user[0].password);
      if (!match) {
        throw new Error('Mot de passe incorrect');
      }
  
      const token = jwt.sign({ userId: user[0].id, email: user[0].email }, process.env.JWT , { expiresIn: '1h' });
  
      return token;
    },

    updateUserPassword: async (userId, newPassword) => {
        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Mettre à jour le mot de passe dans la base de données
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        await db.query(updateQuery, [hashedPassword, userId]);
      },
  };
  
  module.exports = userService;
  