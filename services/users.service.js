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
    const [{affectedRows}] = await db.query('DELETE FROM users WHERE id=?', [id])
    return affectedRows;
}