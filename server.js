const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');

const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const { createAdminUser } = require('./controllers/auth.controller');
const setupWebSocket = require('./services/websocket.service');

const app = express();
const port = 4545;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(authRoutes);
app.use(clientRoutes);

createAdminUser();

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const server = http.createServer(app);

setupWebSocket(server);  // <-- Initialisation WS

server.listen(port, () => {
    console.log(`🚀 Server + WebSocket en écoute sur http://localhost:${port}`);
});
