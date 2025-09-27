const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '199.231.191.243',
    user: 'gael',
    password: 'Admin@24021998',
    database: 'ambohijafy',
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'ambohijafy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;
