const express = require('express');
const router = express.Router();
const UserService = require('../services/user');
const jwt = require('jsonwebtoken');
const {verifyToken, verifyValidity} = require("../config/middlewares");
const {UserModel, getUsersScores} = require("../models/user.model");


router.post('/register', async (req, res) => {
    try {
        const newUser = await UserService.register(req.body);
        if (newUser === undefined || Object.entries(newUser).length === 0) {
            return res.status(404).send({
                success: false,
                message: "A user with the username: " + req.body.username + ", already exists"
            });
        }
        res.status(200).send({
            success: true,
            message: "User registered",
            user: newUser
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to register user"
        })
    }
});

router.post('/login', async (req, res) => {
    try {
        const {user, token} = await UserService.login(req.body);
        if (user === undefined || Object.entries(user).length === 0) {
            return res.status(404).send({
                success: false,
                message: "A user with that username and password doesn't exist"
            });
        }

        res.status(200).send({
            success: true,
            token: token,
            user: user
        });
    }catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to login user"
        })
    }
});

router.post('/addScore', verifyToken, verifyValidity, async (req, res) => {
    try {
        const payload = jwt.decode(req.token);
        const userName = payload.user.username;
        const user = await UserService.addScore(req.body, userName);
        if (user === undefined || Object.entries(user).length === 0) {
            return res.status(404).send({
                success: false,
                message: "A user with that username and password doesn't exist"
            });
        }

        res.status(200).send({
            success: true,
            message: "score added"
        });
    }catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to login user"
        })
    }
});

router.get('/getScore', verifyToken, verifyValidity, async (req, res) => {
    try {
        const userScores = await UserService.getScore(req.query.username, req.token);
        if (userScores === undefined) {
            return res.status(404).send({
                success: false,
                message: "A user with that username and password doesn't exist"
            });
        }

        res.status(200).send({
            scores: userScores,
            success: true
        });        
    }catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to login user"
        })
    }
    
});

router.get('/getLeaderboard', verifyToken, verifyValidity, async (req, res) => {
    try {
        const scores = await getUsersScores(req.token);
        
        if (scores === undefined) {
            return res.status(404).send({
                success: false,
                message: "Failed to retrieve the leaderboard"
            });
        }
        res.status(200).send(scores);
    }catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to retrieve the leaderboard"
        })
    }
});

module.exports = router;