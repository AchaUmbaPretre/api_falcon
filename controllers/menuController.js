const { db } = require("./../config/database");

const util = require('util');

// Promisify the query function
const query = util.promisify(db.query).bind(db);

exports.menusAll = (req, res) => {
    const {userId} = req.query;

    const query = `
        SELECT 
            menus.id AS menu_id, 
            menus.title AS menu_title, 
            menus.url AS menu_url, 
            menus.icon AS menu_icon, 
            submenus.id AS submenu_id, 
            submenus.title AS submenu_title, 
            submenus.url AS submenu_url, 
            submenus.icon AS submenu_icon
        FROM menus 
        INNER JOIN submenus ON menus.id = submenus.menu_id
        LEFT JOIN permission ON menus.id = permission.menus_id
        ${userId ? `WHERE permission.user_id = ${userId}` : ''}
        GROUP BY menus.id, submenus.id
        ORDER BY menus.indexNum Asc
    `;

    db.query(query,(err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des menus:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des menus' });
        }

        // Traiter les résultats pour structurer les données comme attendu dans le frontend
        const menus = [];
        let currentMenu = null;

        results.forEach(row => {
            if (!currentMenu || currentMenu.menu_id !== row.menu_id) {
                // Nouveau menu rencontré, créer un nouvel objet menu
                currentMenu = {
                    menu_id: row.menu_id,
                    menu_title: row.menu_title,
                    menu_url: row.menu_url,
                    menu_icon: row.menu_icon,
                    subMenus: []
                };
                menus.push(currentMenu);
            }

            // Ajouter le sous-menu au menu courant
            currentMenu.subMenus.push({
                submenu_id: row.submenu_id,
                submenu_title: row.submenu_title,
                submenu_url: row.submenu_url,
                submenu_icon: row.submenu_icon
            });
        });

        res.json(menus);
    });
};
;
exports.menusAllPermission = (req, res) => {

    const query = `
        SELECT 
            menus.id AS menu_id, 
            menus.title AS menu_title, 
            menus.url AS menu_url, 
            menus.icon AS menu_icon, 
            submenus.id AS submenu_id, 
            submenus.title AS submenu_title, 
            submenus.url AS submenu_url, 
            submenus.icon AS submenu_icon
        FROM menus 
        INNER JOIN submenus ON menus.id = submenus.menu_id
        ORDER BY menus.id, submenus.id
    `;

    db.query(query,(err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des menus:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des menus' });
        }

        // Traiter les résultats pour structurer les données comme attendu dans le frontend
        const menus = [];
        let currentMenu = null;

        results.forEach(row => {
            if (!currentMenu || currentMenu.menu_id !== row.menu_id) {
                // Nouveau menu rencontré, créer un nouvel objet menu
                currentMenu = {
                    menu_id: row.menu_id,
                    menu_title: row.menu_title,
                    menu_url: row.menu_url,
                    menu_icon: row.menu_icon,
                    subMenus: []
                };
                menus.push(currentMenu);
            }

            // Ajouter le sous-menu au menu courant
            currentMenu.subMenus.push({
                submenu_id: row.submenu_id,
                submenu_title: row.submenu_title,
                submenu_url: row.submenu_url,
                submenu_icon: row.submenu_icon
            });
        });

        res.json(menus);
    });
};

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


/* exports.permissions = (req, res) => {
    const query = 'SELECT * FROM Permissions';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des permissions:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
        }
        res.json(results);
    });
}; */ 

exports.permissions =  (req, res) => {
    const {userId} = req.query;
    db.query(
      'SELECT p.*,o.title, u.username FROM permission p JOIN menus o ON p.menus_id = o.id JOIN users u ON p.user_id = u.id WHERE p.user_id = ?',
      [userId],
      (err, results) => {
        if (err) throw err;
        res.json(results);
      }
    );
  };

exports.putPermission = (req, res) => {
    const userId = req.params.userId;
  const optionId = req.params.optionId;
  const { can_read, can_edit, can_delete } = req.body;

  db.query(
    'REPLACE INTO permission (user_id, menus_id, can_read, can_edit, can_delete) VALUES (?, ?, ?, ?, ?)',
    [userId, optionId, can_read, can_edit, can_delete],
    (err, results) => {
      if (err) throw err;
      res.json({ message: 'Permissions updated successfully!' });
    }
  );
}




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