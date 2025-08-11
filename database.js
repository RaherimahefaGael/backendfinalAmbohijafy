const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '148.230.125.64',
    user: 'root',
    password: 'ambohijafy',
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
