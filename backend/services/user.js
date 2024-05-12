const UserService = require('../models/user.model'); // Adjusted import
const {UserModel, ScoreModel} = UserService;
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

async function register(userInput) {
    try {
        const user = await UserService.getUserByUsername(userInput.username);
        if (user) {
            return;
        }

        const newUser = new UserModel({
            username: userInput.username,
            password: userInput.password,
        });
        const createdUser = await UserService.addUser(newUser);
        return createdUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

async function login(userInput) {
    try {
        const user = await UserService.getUserByUsername(userInput.username);
        if (!user) {
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(userInput.password, user.password);
        if (!isPasswordCorrect) {
            return;
        }

        const token = jwt.sign({ user }, 'secretkey');
        return { user, token };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function addScore(userInput, username) {
    try {
        const { points, quiz } = userInput;
        const user = await UserService.getUserByUsername(username);
        if (!user) {
            return;
        }

        const newScore = new ScoreModel({
            user: user._id,
            quiz,
            points: parseInt(points)
        });

        const createdScore = await newScore.save();
        return createdScore;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getScore(username, token) {
    try {
        const payload = jwt.decode(token);
        if (!payload) {
            return;
        }

        const user = await UserModel.findById(payload.user);
        if (!user || user.username !== username) {
            return;
        }

        const scores = await ScoreModel.find({ user: user._id });
        return scores;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function createAdminUserIfNotExists() {
    try {
        const user = await UserService.getUserByUsername("admin@gmail.com");
        if (user) {
            console.log("Admin user found");
            return;
        }

        console.log("No Admin user found, creating admin user");

        const newUser = new UserModel({
            username: 'admin@gmail.com',
            password: 'admin@123',
            isAdmin: true,
        });
        const createdUser = await UserService.addUser(newUser);
        return createdUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    register,
    login,
    addScore,
    getScore,
    createAdminUserIfNotExists
}
