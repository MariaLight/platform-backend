// разовый скрипт, чтобы выгрузить локальную базу в sql-файл
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

const tables = ['roles', 'users', 'courses', 'modules', 'lessons', 'lesson_comments', 'user_courses'];

function esc(v) {
    if (v === null || v === undefined) return 'NULL';
    if (v instanceof Date) {
        const s = v.toISOString().slice(0, 19).replace('T', ' ');
        return "'" + s + "'";
    }
    if (Buffer.isBuffer(v)) {
        return "'" + v.toString('utf8').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    }
    if (typeof v === 'number') return String(v);
    return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

(async () => {
    let out = '-- dump для aiven, без CREATE DATABASE\nSET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n\n';

    for (const t of tables) {
        try {
            const [rows] = await db.query('SELECT * FROM `' + t + '`');
            const [cols] = await db.query('SHOW COLUMNS FROM `' + t + '`');
            console.log(t, rows.length, 'строк');

            out += 'DROP TABLE IF EXISTS `' + t + '`;\n';

            // crudely copy create table
            const [createRes] = await db.query('SHOW CREATE TABLE `' + t + '`');
            const createSql = createRes[0]['Create Table'];
            out += createSql + ';\n\n';

            if (rows.length) {
                const names = cols.map((c) => '`' + c.Field + '`').join(', ');
                for (const row of rows) {
                    const vals = cols.map((c) => esc(row[c.Field])).join(', ');
                    out += 'INSERT INTO `' + t + '` (' + names + ') VALUES (' + vals + ');\n';
                }
                out += '\n';
            }
        } catch (e) {
            console.log('не выгрузила', t, e.message);
        }
    }

    out += 'SET FOREIGN_KEY_CHECKS=1;\n';
    const file = path.join('D:', 'DIPLOM', 'platform_for_courses_dump.sql');
    fs.writeFileSync(file, out, 'utf8');
    console.log('готово:', file);
    process.exit(0);
})().catch((e) => {
    console.log('дамп упал', e);
    process.exit(1);
});
