const db = require('../db')

module.exports.getAllUsers = async () => {
    const [records] = await db.query('SELECT * FROM users')
    return records;
}
module.exports.getUserById = async (id) => {
    const [record] = await db.query('SELECT * FROM users WHERE id=?', [id])
    return record;
}
module.exports.deleteUser = async (id) => {
    const [{ affectedRows }] = await db.query('DELETE FROM users WHERE id=?', [id])
    return affectedRows;
}
module.exports.addUser = async (user) => {
    try {
        const result = await db.query(
            'INSERT INTO users (email, password, name, user_img, registered_at, role_id) VALUES (?, ?, ?, ?,?,?)',
            [user.email, user.password, user.name, user.user_img, user.registered_at, user.role_id]
        );
        return result.insertId;
    } catch (error) {
        console.error('Ошибка при добавлении пользователя:', error);
        return null;
    }
}