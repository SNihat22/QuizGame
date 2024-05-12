const jwt = require("jsonwebtoken");


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader === 'undefined') {
        return res.sendStatus(403);
    }
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
}

function verifyValidity(req, res, next) {
    const token  = req.token;

    try {

        jwt.verify(token, 'secretkey');

        next();
    }catch (e) {
        res.send({
            status: 401,
            message: 'Invalid token'
        })
    }
}

async function isAdmin(req, res, next)  {
    try {
        const payload = jwt.decode(req.token);
        const user = payload.user;
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).send('User is not an admin.');
        }
    } catch (error) {
        res.status(500).send('There was a problem finding the user.');
    }
};

module.exports = {
    verifyToken,
    verifyValidity,
    isAdmin
}