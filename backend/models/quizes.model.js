const mongoose = require('mongoose');

// Define the Quiz schema
const QuizSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    collection: 'quizzes'
});

// Define the Question schema
const QuestionSchema = mongoose.Schema({
    quiz: {
        type: mongoose.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    answer: {
        type: String,
        required: true
    }
}, {
    collection: 'questions'
});

const Quiz = mongoose.model('Quiz', QuizSchema);
const Question = mongoose.model('Question', QuestionSchema);

module.exports = {
    Quiz,
    Question
};
