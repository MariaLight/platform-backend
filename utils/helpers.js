const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const formatDate = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

const toMysqlDateTime = (value) => {
    if (!value) {
        return formatDate(new Date());
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return formatDate(new Date());
    }

    return formatDate(parsed);
};

const quoteIdent = (field) => (field === 'order' ? '`order`' : field);

const buildUpdateQuery = (table, id, data, allowedFields) => {
    const fields = allowedFields.filter((field) => data[field] !== undefined);

    if (fields.length === 0) {
        return null;
    }

    const setClause = fields.map((field) => `${quoteIdent(field)} = ?`).join(', ');
    const values = fields.map((field) => data[field]);

    return {
        sql: `UPDATE ${table} SET ${setClause} WHERE id = ?`,
        values: [...values, id],
    };
};

const normalizePassword = (user) => {
    if (!user) {
        return user;
    }

    if (Buffer.isBuffer(user.password)) {
        user.password = user.password.toString('utf8');
    }

    return user;
};

module.exports = {
    asyncHandler,
    toMysqlDateTime,
    quoteIdent,
    buildUpdateQuery,
    normalizePassword,
};
