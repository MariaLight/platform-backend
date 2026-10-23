const db = require('../db');
const { toMysqlDateTime, buildUpdateQuery, normalizePassword } = require('../utils/helpers');

const USER_FIELDS = 'id, email, CONVERT(password USING utf8mb4) AS password, name, user_img, registered_at, role_id';

module.exports.getAllUsers = async (email) => {
    if (email) {
        const [records] = await db.query(
            `SELECT ${USER_FIELDS} FROM users WHERE email = ?`,
            [email]
        );
        return records.map(normalizePassword);
    }

    const [records] = await db.query(`SELECT ${USER_FIELDS} FROM users`);
    return records.map(normalizePassword);
};

module.exports.getUserById = async (id) => {
    const [records] = await db.query(
        `SELECT ${USER_FIELDS} FROM users WHERE id = ?`,
        [id]
    );
    return normalizePassword(records[0] || null);
};

module.exports.deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports.addUser = async (user) => {
    const [result] = await db.query(
        'INSERT INTO users (email, password, name, user_img, registered_at, role_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
            user.email,
            user.password,
            user.name ?? null,
            user.user_img ?? null,
            toMysqlDateTime(user.registered_at),
            user.role_id ?? 4,
        ]
    );

    return module.exports.getUserById(result.insertId);
};

module.exports.updateUser = async (id, user) => {
    const query = buildUpdateQuery('users', id, user, [
        'email',
        'password',
        'name',
        'user_img',
        'registered_at',
        'role_id',
    ]);

    if (!query) {
        return module.exports.getUserById(id);
    }

    const [result] = await db.query(query.sql, query.values);
    if (result.affectedRows === 0) {
        return null;
    }

    return module.exports.getUserById(id);
};
