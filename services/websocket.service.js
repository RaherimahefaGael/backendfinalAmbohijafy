// // services/websocket.service.js
// const WebSocket = require('ws');

// function setupWebSocket(server) {
//     const wss = new WebSocket.Server({ server });

//     wss.on('connection', (ws) => {
//         console.log('🟢 Nouvelle connexion WebSocket');

//         ws.on('message', (message) => {
//             console.log('📨 Message reçu :', message);

//             // Diffuser à tous les clients connectés
//             wss.clients.forEach((client) => {
//                 if (client.readyState === WebSocket.OPEN) {
//                     client.send(message);
//                 }
//             });
//         });

//         ws.on('close', () => {
//             console.log('🔴 Connexion WebSocket fermée');
//         });
//     });

//     return wss; // si tu veux manipuler le serveur WS ailleurs
// }

// module.exports = setupWebSocket;
// backend.js (Express + WebSocket)
const WebSocket = require('ws');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    const clients = new Map(); // clientId => ws

    wss.on('connection', (ws) => {
        console.log('🟢 Nouvelle connexion WebSocket');

        ws.on('message', (message) => {
            let data;
            try {
                data = JSON.parse(message);
            } catch (e) {
                console.log('⚠️ Message non JSON:', message);
                return;
            }

            if (data.type === 'register' && data.clientId) {
                clients.set(data.clientId, ws);
                console.log(`✅ Client enregistré : ${data.clientId}`);
                broadcastClientList();
                return;
            }

            if (data.type === 'message' && data.target && data.message) {
                const targetWs = clients.get(data.target);
                if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                    targetWs.send(JSON.stringify({
                        from: data.from,
                        message: data.message
                    }));
                    console.log(`➡️ Message envoyé à ${data.target}`);
                } else {
                    console.log(`❌ Client cible non connecté : ${data.target}`);
                }
                return;
            }
        });

        ws.on('close', () => {
            for (const [clientId, socket] of clients.entries()) {
                if (socket === ws) {
                    clients.delete(clientId);
                    console.log(`❌ Client déconnecté : ${clientId}`);
                    broadcastClientList();
                    break;
                }
            }
        });

        function broadcastClientList() {
            const list = Array.from(clients.keys());
            const payload = JSON.stringify({ type: 'clientList', clients: list });
            for (const client of clients.values()) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            }
        }
    });
}

module.exports = setupWebSocket;
