const express = require('express');
const router = express.Router();
const { Quiz, Question } = require('../models/quizes.model');
const { verifyToken, isAdmin } = require("../config/middlewares");
const mongoose = require("mongoose"); // Make sure this path is correct

// Route to create a quiz (only accessible to admins)
router.post('/create', verifyToken, isAdmin, async (req, res) => {
    const { title, description, questions } = req.body;

    // Create the quiz
    const newQuiz = new Quiz({
        title,
        description
    });

    try {
        const savedQuiz = await newQuiz.save();

        // Create the questions and associate them with the quiz
        const questionPromises = questions.map(q => {
            const newQuestion = new Question({
                quiz: savedQuiz._id,
                question: q.question,
                options: q.options,
                answer: q.answer
            });
            return newQuestion.save();
        });

        await Promise.all(questionPromises);

        res.status(201).json(savedQuiz);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create quiz.' });
    }
});

// Route to get all quizzes (accessible to anyone with a valid token)
router.get('/', verifyToken, async (req, res) => {
    try {
        // Fetch all quizzes
        const quizzes = await Quiz.find();

        // Fetch questions for each quiz and structure the response
        const quizzesWithQuestions = await Promise.all(quizzes.map(async (quiz) => {
            const questions = await Question.find({ quiz: quiz._id });
            return {
                _id: quiz._id, // Include the _id
                title: quiz.title,
                description: quiz.description,
                questions: questions.map(question => ({
                    question: question.question,
                    options: question.options,
                    answer: question.answer
                }))
            };
        }));

        res.json(quizzesWithQuestions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quizzes.' });
    }
});

// Route to fetch a quiz by ID (accessible to anyone with a valid token)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questions = await Question.find({ quiz: req.params.id });

        const quizWithQuestions = {
            _id: quiz._id, // Include the _id
            title: quiz.title,
            description: quiz.description,
            questions: questions.map(question => ({
                question: question.question,
                options: question.options,
                answer: question.answer
            }))
        };

        res.json(quizWithQuestions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
});

// Route to update a quiz by ID (only accessible to admins)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { title, description, questions } = req.body;

    try {
        // Find and update the quiz details
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Remove existing questions associated with the quiz
        await Question.deleteMany({ quiz: req.params.id });

        // Add the updated questions
        const questionPromises = questions.map(q => {
            const newQuestion = new Question({
                quiz: req.params.id,
                question: q.question,
                options: q.options,
                answer: q.answer
            });
            return newQuestion.save();
        });

        await Promise.all(questionPromises);

        // Fetch the updated questions
        const updatedQuestions = await Question.find({ quiz: req.params.id });

        // Structure the response to include the updated questions
        const response = {
            _id: updatedQuiz._id,
            title: updatedQuiz.title,
            description: updatedQuiz.description,
            questions: updatedQuestions.map(question => ({
                _id: question._id,
                question: question.question,
                options: question.options,
                answer: question.answer
            }))
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update quiz' });
    }
});

// Route to delete a quiz by ID (accessible to admins)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await Quiz.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Also delete associated questions
        await Question.deleteMany({ quiz: req.params.id });

        res.json({ message: 'Quiz and associated questions deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

module.exports = router;
