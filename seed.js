// скрипт чтобы накидать тестовых юзеров как в ридми
// запускать из папки бэкенда: node seed.js
require('dotenv').config();
const db = require('./db');

async function run() {
    console.log('старт сида...');

    // колонки из тз/макета, в старой базе их не было
    try {
        await db.query('ALTER TABLE courses ADD COLUMN published_at DATETIME DEFAULT CURRENT_TIMESTAMP');
        console.log('добавила published_at');
    } catch (e) {
        console.log('published_at уже есть или не добавилось', e.code);
    }

    try {
        await db.query('ALTER TABLE user_courses ADD COLUMN access_start DATE NULL');
        console.log('добавила access_start');
    } catch (e) {
        console.log('access_start уже есть?', e.code);
    }

    try {
        await db.query('ALTER TABLE user_courses ADD COLUMN access_end DATE NULL');
        console.log('добавила access_end');
    } catch (e) {
        console.log('access_end уже есть?', e.code);
    }

    // админ уже есть, редактора и учеников докидываю если нет
    const [u2] = await db.query("SELECT id FROM users WHERE email = 'mdlight97@gmail.com'");
    if (u2.length == 0) {
        await db.query(
            "INSERT INTO users (email, password, name, user_img, registered_at, role_id) VALUES (?, ?, ?, ?, NOW(), ?)",
            ['mdlight97@gmail.com', 'qwerty2020', 'Денис', null, 3]
        );
        console.log('редактор ок');
    } else {
        console.log('редактор уже был');
    }

    const [u3] = await db.query("SELECT id FROM users WHERE email = 'testtest@mail.ru'");
    if (u3.length == 0) {
        await db.query(
            "INSERT INTO users (email, password, name, user_img, registered_at, role_id) VALUES (?, ?, ?, ?, NOW(), 4)",
            ['testtest@mail.ru', 'qazxsw', 'Тестовый ученик', null]
        );
        console.log('ученик 1 ок');
    } else {
        console.log('ученик 1 уже был');
    }

    const [u4] = await db.query("SELECT id FROM users WHERE email = 'testtest2@mail.ru'");
    if (u4.length == 0) {
        await db.query(
            "INSERT INTO users (email, password, name, registered_at, role_id) VALUES ('testtest2@mail.ru', 'qazxsw', NULL, NOW(), 4)"
        );
        console.log('ученик 2 ок');
    } else {
        console.log('ученик 2 уже был');
    }

    // названия курсов в отчёте были просто Курс 1, так себе для скринов
    await db.query("UPDATE courses SET title = 'Академический курс “Математический анализ”' WHERE id = 1 AND title = 'Курс 1'");
    await db.query("UPDATE courses SET title = 'Аналитическая геометрия' WHERE id = 2 AND title = 'Курс 2'");
    await db.query("UPDATE courses SET title = 'Общая физика' WHERE id = 3 AND title = 'Курс 3'");

    const [stud] = await db.query("SELECT id FROM users WHERE email = 'testtest@mail.ru'");
    const [stud2] = await db.query("SELECT id FROM users WHERE email = 'testtest2@mail.ru'");
    const studentId = stud[0].id;
    const studentId2 = stud2[0].id;

    // ученику надо хоть какие-то курсы иначе пустая страница
    const [have] = await db.query('SELECT * FROM user_courses WHERE user_id = ? AND course_id = 1', [studentId]);
    if (have.length == 0) {
        await db.query(
            'INSERT INTO user_courses (user_id, course_id, access_start, access_end) VALUES (?, 1, ?, ?)',
            [studentId, '2024-09-01', '2026-09-01']
        );
        await db.query(
            'INSERT INTO user_courses (user_id, course_id, access_start, access_end) VALUES (?, 2, "2024-09-01", "2026-09-01")',
            [studentId]
        );
        console.log('курсы ученику 1 проставила');
    } else {
        console.log('у ученика 1 курсы уже были');
    }

    const [have2] = await db.query('SELECT * FROM user_courses WHERE user_id = ?', [studentId2]);
    if (have2.length == 0) {
        await db.query('INSERT INTO user_courses (user_id, course_id, access_start, access_end) VALUES (?, 1, "2024-09-01", "2026-09-01")', [studentId2]);
        console.log('курс ученику 2 тоже');
    }

    const [all] = await db.query('SELECT id, email, role_id FROM users');
    console.log('юзеры сейчас:', all);
    const [links] = await db.query('SELECT * FROM user_courses');
    console.log('связки:', links);
    console.log('готово');
    process.exit(0);
}

run().catch((err) => {
    console.log('сид упал', err);
    process.exit(1);
});
