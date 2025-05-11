const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'platform_user',
    password: 'LeczLecz1',
    database: 'platform_for_courses'
})

module.exports = mysqlPool;