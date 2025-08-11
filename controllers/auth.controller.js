const bcrypt = require('bcrypt');
const db = require('../database');

exports.createAdminUser = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
        if (rows.length === 0) {
            const hash = await bcrypt.hash('admin', 10);
            await db.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash]);
            console.log('Admin user created');
        }
    } catch (err) {
        console.error('Erreur admin :', err);
    }
};

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length) return res.status(400).json({ error: 'Username exists' });
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // console.log('Tentative de connexion :', username);

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (!rows.length) {
            return res.status(400).json({ error: 'Nom d’utilisateur incorrect' });
        }

        const user = rows[0];

        if (user.password !== password) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        res.json({
            message: 'Connexion réussie',
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (!rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });
        const user = rows[0];
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
        const hash = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
        res.json({ message: 'Mot de passe modifié' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
    }
};