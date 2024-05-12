const express = require('express');
const cors = require('cors');
const {verifyToken, verifyValidity} = require("./config/middlewares");

module.exports = function createServer() {
    const app = express();
    const users = require('./routes/user.router');
    const quizzes = require('./routes/quizes.router');
    const corsOptions = {
        origin: 'http://localhost:4200'
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/api/v1/user', users);
    app.use('/api/v1/quizzes', verifyToken, verifyValidity, quizzes);

    return app;
};