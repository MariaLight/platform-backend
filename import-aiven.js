// заливает dump в aiven, чтобы не мучиться с драйверами dbeaver
// 1) скопировать .env.aiven.example в .env.aiven и вписать данные с Overview
// 2) node import-aiven.js
require('dotenv').config({ path: '.env.aiven' });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const dumpPath = path.join('D:', 'DIPLOM', 'platform_for_courses_dump.sql');

(async () => {
    console.log('подключаюсь к', process.env.DB_HOST, process.env.DB_PORT);

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
        ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false },
    });

    console.log('ок, читаю дамп');
    let sql = fs.readFileSync(dumpPath, 'utf8');
    // выкинуть комментарии
    sql = sql.split('\n').filter((line) => !line.trim().startsWith('--')).join('\n');

    const parts = sql.split(';').map((s) => s.trim()).filter(Boolean);

    for (let i = 0; i < parts.length; i++) {
        try {
            await conn.query(parts[i]);
            if (i % 5 === 0) console.log('выполнила', i + 1, '/', parts.length);
        } catch (e) {
            console.log('ошибка на куске', i + 1, parts[i].slice(0, 80), e.message);
            throw e;
        }
    }

    const [users] = await conn.query('SELECT id, email, role_id FROM users');
    console.log('юзеры в aiven:', users);
    await conn.end();
    console.log('готово, таблицы залиты');
})().catch((e) => {
    console.log('не залилось', e.message);
    process.exit(1);
});
