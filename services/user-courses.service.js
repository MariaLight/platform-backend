const db = require('../db');
const { toMysqlDateTime, buildUpdateQuery } = require('../utils/helpers');

module.exports.getAllUserCourses = async (userId) => {
    if (userId) {
        const [records] = await db.query(
            'SELECT * FROM user_courses WHERE user_id = ?',
            [userId]
        );
        return records;
    }

    const [records] = await db.query('SELECT * FROM user_courses');
    return records;
};

module.exports.getUserCourseById = async (id) => {
    const [records] = await db.query('SELECT * FROM user_courses WHERE id = ?', [id]);
    return records[0] || null;
};

module.exports.addUserCourse = async (userCourse) => {
    try {
        const [result] = await db.query(
            'INSERT INTO user_courses (user_id, course_id, access_start, access_end) VALUES (?, ?, ?, ?)',
            [
                userCourse.user_id,
                userCourse.course_id,
                userCourse.access_start ? toMysqlDateTime(userCourse.access_start) : null,
                userCourse.access_end ? toMysqlDateTime(userCourse.access_end) : null,
            ]
        );
        return module.exports.getUserCourseById(result.insertId);
    } catch (err) {
        if (err.code !== 'ER_BAD_FIELD_ERROR') {
            throw err;
        }

        const [result] = await db.query(
            'INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)',
            [userCourse.user_id, userCourse.course_id]
        );
        return module.exports.getUserCourseById(result.insertId);
    }
};

module.exports.updateUserCourse = async (id, userCourse) => {
    const data = { ...userCourse };

    if (data.access_start !== undefined) {
        data.access_start = data.access_start ? toMysqlDateTime(data.access_start) : null;
    }
    if (data.access_end !== undefined) {
        data.access_end = data.access_end ? toMysqlDateTime(data.access_end) : null;
    }

    const query = buildUpdateQuery('user_courses', id, data, [
        'user_id',
        'course_id',
        'access_start',
        'access_end',
    ]);

    if (!query) {
        return module.exports.getUserCourseById(id);
    }

    const [result] = await db.query(query.sql, query.values);
    if (result.affectedRows === 0) {
        return null;
    }

    return module.exports.getUserCourseById(id);
};

module.exports.deleteUserCourse = async (id) => {
    const [result] = await db.query('DELETE FROM user_courses WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
