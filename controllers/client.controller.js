const db = require('../database');
const path = require('path');
const fs = require('fs');

exports.getClients = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clients');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addClient = async (req, res) => {
    const { nom, ref, no_compteur, adresse } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await db.query(
            'INSERT INTO clients (nom, ref, no_compteur, adresse, photo) VALUES (?, ?, ?, ?, ?)',
            [nom, ref, no_compteur, adresse, photo]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateClient = async (req, res) => {
    const { id } = req.params;
    const { nom, ref, no_compteur, adresse } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [rows] = await db.query('SELECT photo FROM clients WHERE id = ?', [id]);
        const oldPhoto = rows.length ? rows[0].photo : null;

        await db.query(
            'UPDATE clients SET nom = ?, ref = ?, no_compteur = ?, adresse = ?, photo = ? WHERE id = ?',
            [nom, ref, no_compteur, adresse, photo, id]
        );

        if (oldPhoto && oldPhoto !== photo) {
            const oldPath = path.join(__dirname, '..', oldPhoto);
            fs.unlink(oldPath, (err) => {
                if (err) console.error('Erreur suppression photo :', err);
            });
        }
        res.json({ message: 'Client modifié' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT photo FROM clients WHERE id = ?', [id]);
        const photo = rows.length ? rows[0].photo : null;
        await db.query('DELETE FROM clients WHERE id = ?', [id]);
        if (photo) {
            const photoPath = path.join(__dirname, '..', photo);
            fs.unlink(photoPath, (err) => {
                if (err) console.error('Erreur suppression photo :', err);
            });
        }
        res.json({ message: 'Client supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};