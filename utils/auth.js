const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'SECRET_KEY' } = process.env;

const token = NODE_ENV === 'production' ? JWT_SECRET : 'secret';

const getJwtToken = (payload) => jwt.sign(payload, token, { expiresIn: '7d' });

module.exports = getJwtToken;
