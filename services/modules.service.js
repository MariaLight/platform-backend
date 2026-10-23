const db = require('../db');
const { buildUpdateQuery } = require('../utils/helpers');

module.exports.getAllModules = async (courseId) => {
    if (courseId) {
        const [records] = await db.query(
            'SELECT * FROM modules WHERE course_id = ? ORDER BY `order`, id',
            [courseId]
        );
        return records;
    }

    const [records] = await db.query('SELECT * FROM modules ORDER BY `order`, id');
    return records;
};

module.exports.getModuleById = async (id) => {
    const [records] = await db.query('SELECT * FROM modules WHERE id = ?', [id]);
    return records[0] || null;
};

module.exports.addModule = async (moduleItem) => {
    const [result] = await db.query(
        'INSERT INTO modules (title, image_url, `order`, course_id) VALUES (?, ?, ?, ?)',
        [
            moduleItem.title,
            moduleItem.image_url ?? null,
            moduleItem.order ?? 1,
            moduleItem.course_id,
        ]
    );

    return module.exports.getModuleById(result.insertId);
};

module.exports.updateModule = async (id, moduleItem) => {
    const query = buildUpdateQuery('modules', id, moduleItem, [
        'title',
        'image_url',
        'order',
        'course_id',
    ]);

    if (!query) {
        return module.exports.getModuleById(id);
    }

    const [result] = await db.query(query.sql, query.values);
    if (result.affectedRows === 0) {
        return null;
    }

    return module.exports.getModuleById(id);
};

module.exports.deleteModule = async (id) => {
    const [result] = await db.query('DELETE FROM modules WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
