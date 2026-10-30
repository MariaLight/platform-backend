// заливает dump в aiven
// данные только в .env.aiven, запускать из папки platform-backend
require('dotenv').config({ path: '.env.aiven' });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function clean(v) {
    if (!v) return '';
    let s = String(v).trim();
    // если случайно в кавычки взяли
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.slice(1, -1);
    }
    return s.trim();
}

const dumpPath = path.join('D:', 'DIPLOM', 'platform_for_courses_dump.sql');

(async () => {
    const host = clean(process.env.DB_HOST);
    const port = Number(clean(process.env.DB_PORT));
    const user = clean(process.env.DB_USER);
    const password = clean(process.env.DB_PASSWORD);
    const database = clean(process.env.DB_NAME);

    console.log('host:', host);
    console.log('port:', port);
    console.log('user:', user);
    console.log('db:', database);
    console.log('длина пароля:', password.length);
    console.log('ssl: да, принудительно');

    if (!host || !port || !user || !password || !database) {
        console.log('в .env.aiven чего-то не хватает, все поля надо заполнить');
        process.exit(1);
    }

    const conn = await mysql.createConnection({
        host,
        port,
        user,
        password,
        database,
        multipleStatements: true,
        ssl: { rejectUnauthorized: false },
    });

    console.log('ок, читаю дамп');
    let sql = fs.readFileSync(dumpPath, 'utf8');
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
