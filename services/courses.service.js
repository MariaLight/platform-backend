const db = require('../db');
const { toMysqlDateTime, buildUpdateQuery } = require('../utils/helpers');

module.exports.getAllCourses = async () => {
    const [records] = await db.query('SELECT * FROM courses ORDER BY id');
    return records;
};

module.exports.getCourseById = async (id) => {
    const [records] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    return records[0] || null;
};

module.exports.addCourse = async (course) => {
    try {
        const [result] = await db.query(
            'INSERT INTO courses (title, image_url, published_at) VALUES (?, ?, ?)',
            [
                course.title,
                course.image_url ?? null,
                toMysqlDateTime(course.published_at),
            ]
        );
        return module.exports.getCourseById(result.insertId);
    } catch (err) {
        if (err.code !== 'ER_BAD_FIELD_ERROR') {
            throw err;
        }

        const [result] = await db.query(
            'INSERT INTO courses (title, image_url) VALUES (?, ?)',
            [course.title, course.image_url ?? null]
        );
        return module.exports.getCourseById(result.insertId);
    }
};

module.exports.updateCourse = async (id, course) => {
    const query = buildUpdateQuery('courses', id, course, [
        'title',
        'image_url',
        'published_at',
    ]);

    if (!query) {
        return module.exports.getCourseById(id);
    }

    const [result] = await db.query(query.sql, query.values);
    if (result.affectedRows === 0) {
        return null;
    }

    return module.exports.getCourseById(id);
};

module.exports.deleteCourse = async (id) => {
    const [result] = await db.query('DELETE FROM courses WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
