const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'users'
    });

const ScoreSchema = mongoose.Schema({
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quiz: {
            type: mongoose.Types.ObjectId,
            ref: 'Quiz',
            required: true
        },
        points: {
            type: Number,
            required: true
        }
    },
    {
        collection: 'scores'
    });

const UserModel = module.exports.UserModel = mongoose.model('User', UserSchema);
const ScoreModel = module.exports.ScoreModel = mongoose.model('Score', ScoreSchema);

module.exports = {
    UserModel,
    ScoreModel
};

module.exports.getUserById = function(id, callback) {
    UserModel.findById(id, callback);
}

module.exports.getUsers = async function() {
    try {
        const users = await UserModel.find({});
        return users;
    } catch (error) {
        throw error;
    }
}

module.exports.getUserByUsername = async function(username) {
    const query = { username: username }
    try {
        const user = await UserModel.findOne(query);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports.addUser = async function(newUser) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
        throw error;
    }
}

module.exports.getUsersScores = async function() {
    const usersScores = [];
    try {
        const users = await UserModel.find({});

        for (const user of users) {
            if (user.isAdmin) continue;

            const scores = await ScoreModel.find({ user: user._id });
            const gamesPlayed = scores.length;
            const totalScores = scores.reduce((p, c) => p + c.points, 0);
            const averageScore = gamesPlayed ? totalScores / gamesPlayed : 0;

            usersScores.push({
                username: user.username,
                gamesPlayed: gamesPlayed,
                totalScores: totalScores,
                averageScore: averageScore
            });
        }

        // Sort usersScores based on averageScore in descending order
        usersScores.sort((a, b) => b.averageScore - a.averageScore);

        return usersScores;
    } catch (error) {
        throw error;
    }
}
