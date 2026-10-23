const db = require('../db');
const { buildUpdateQuery } = require('../utils/helpers');

module.exports.getAllLessons = async (moduleId) => {
    if (moduleId) {
        const [records] = await db.query(
            'SELECT * FROM lessons WHERE module_id = ? ORDER BY `order`, id',
            [moduleId]
        );
        return records;
    }

    const [records] = await db.query('SELECT * FROM lessons ORDER BY `order`, id');
    return records;
};

module.exports.getLessonById = async (id) => {
    const [records] = await db.query('SELECT * FROM lessons WHERE id = ?', [id]);
    return records[0] || null;
};

module.exports.addLesson = async (lesson) => {
    const [result] = await db.query(
        'INSERT INTO lessons (title, image_url, `order`, content, video_url, module_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
            lesson.title,
            lesson.image_url ?? null,
            lesson.order ?? 1,
            lesson.content ?? null,
            lesson.video_url ?? null,
            lesson.module_id,
        ]
    );

    return module.exports.getLessonById(result.insertId);
};

module.exports.updateLesson = async (id, lesson) => {
    const query = buildUpdateQuery('lessons', id, lesson, [
        'title',
        'image_url',
        'order',
        'content',
        'video_url',
        'module_id',
    ]);

    if (!query) {
        return module.exports.getLessonById(id);
    }

    const [result] = await db.query(query.sql, query.values);
    if (result.affectedRows === 0) {
        return null;
    }

    return module.exports.getLessonById(id);
};

module.exports.deleteLesson = async (id) => {
    const [result] = await db.query('DELETE FROM lessons WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
