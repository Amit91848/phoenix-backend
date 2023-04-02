const { sign, verfiy } = require('jsonwebtoken');
const User = require('../Schemas/UserSchema');

const createAccessToken = async (user) => {
    const { _id, isUser } = user;
    const jwtSign = sign({ _id: _id, isUser: isUser }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10d' });
    return jwtSign;
}

module.exports = {
    createAccessToken
}