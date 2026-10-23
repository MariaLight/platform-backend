require('dotenv').config();

const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'platform_user',
    password: process.env.DB_PASSWORD || 'LeczLecz1',
    database: process.env.DB_NAME || 'platform_for_courses',
    waitForConnections: true,
    connectionLimit: 10,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

module.exports = mysqlPool;
