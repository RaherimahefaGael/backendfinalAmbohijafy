const express = require('express');
const router = express.Router();
const client = require('../controllers/client.controller');
const upload = require('../middlewares/upload');

router.get('/clients', client.getClients);
router.post('/clients', upload.single('photo'), client.addClient);
router.put('/clients/:id', upload.single('photo'), client.updateClient);
router.delete('/clients/:id', client.deleteClient);

module.exports = router;