require('dotenv').config();

const mysql = require('mysql2/promise');

// trim — на render иногда копируется пробел в конце переменной
const dbHost = (process.env.DB_HOST || 'localhost').trim();
const dbPort = Number((process.env.DB_PORT || '3306').trim());
const dbUser = (process.env.DB_USER || 'platform_user').trim();
const dbPassword = (process.env.DB_PASSWORD || 'LeczLecz1').trim();
const dbName = (process.env.DB_NAME || 'platform_for_courses').trim();
const dbSsl = (process.env.DB_SSL || 'false').trim() === 'true';

console.log('mysql host:', dbHost, 'port:', dbPort, 'ssl:', dbSsl);

const mysqlPool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: dbSsl ? { rejectUnauthorized: false } : undefined,
});

module.exports = mysqlPool;
