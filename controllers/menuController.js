const { db } = require("./../config/database");

const util = require('util');

// Promisify the query function
const query = util.promisify(db.query).bind(db);

exports.getMenu = async (req, res) => {
    const userId = req.query.userId;

    try {
        const userPermissions = await db.query('SELECT permission_id FROM UserPermissions WHERE user_id = ?', [userId]);
        const permissionIds = userPermissions.map(up => up.permission_id);

        const menus = await db.query(`
            SELECT m.id, m.title, m.url, m.icon 
            FROM Menus m
            INNER JOIN MenuPermissions mp ON m.id = mp.menu_id
            WHERE mp.permission_id IN (?)
            GROUP BY m.id`, [permissionIds]);

        const subMenus = await db.query(`
            SELECT sm.id, sm.menu_id, sm.title, sm.url, sm.icon 
            FROM SubMenus sm
            INNER JOIN SubMenuPermissions smp ON sm.id = smp.submenu_id
            WHERE smp.permission_id IN (?)
            GROUP BY sm.id`, [permissionIds]);

        res.json({ menus, subMenus });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des menus' });
    }
};


exports.permissions = (req, res) => {
    const query = 'SELECT * FROM Permissions';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des permissions:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
        }
        res.json(results);
    });
};




exports.getPermissions = async (req, res) => {
    try {
        const userPermissions = await query(`
            SELECT up.user_id, p.name AS permission, m.title AS menu_title, sm.title AS submenu_title
            FROM UserPermissions up
            JOIN Permissions p ON up.permission_id = p.id
            LEFT JOIN MenuPermissions mp ON mp.permission_id = up.permission_id
            LEFT JOIN Menus m ON mp.menu_id = m.id
            LEFT JOIN SubMenuPermissions smp ON smp.permission_id = up.permission_id
            LEFT JOIN SubMenus sm ON smp.submenu_id = sm.id
        `);
        res.json(userPermissions);
    } catch (error) {
        console.error('Erreur lors de la récupération des permissions des utilisateurs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des permissions des utilisateurs' });
    }
};

exports.PostUserPermission = async (req, res) => {
    const { userId, permissionIds } = req.body;
    try {
        await db.query('DELETE FROM UserPermissions WHERE user_id = ?', [userId]);
        for (const permissionId of permissionIds) {
            await db.query('INSERT INTO UserPermissions (user_id, permission_id) VALUES (?, ?)', [userId, permissionId]);
        }
        res.status(200).json({ message: 'Permissions mises à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour des permissions' });
    }
};