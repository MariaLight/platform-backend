const db = require('../db');

module.exports.getAllRoles = async () => {
    const [records] = await db.query('SELECT * FROM roles');
    return records;
};

module.exports.getRoleById = async (id) => {
    const [records] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    return records[0] || null;
};
