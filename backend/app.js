const createServer = require('./server');
const connect = require('./dbconnect.js');
const {createAdminUserIfNotExists} = require("./services/user");
const mongoose = require("mongoose");
const fs = require("fs");
const {Question,Quiz} = require("./models/quizes.model");

const app = createServer();


const seedData = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('seed-data.json', 'utf8'));

        await Quiz.deleteMany({}); // Clear existing quizzes
        await Question.deleteMany({}); // Clear existing questions

        const quizPromises = data.map(async quizData => {
            const { title, description, questions } = quizData;
            const newQuiz = new Quiz({ title, description });
            const savedQuiz = await newQuiz.save();

            const questionPromises = questions.map(async questionData => {
                const { question, options, answer } = questionData;
                const newQuestion = new Question({
                    quiz: savedQuiz._id,
                    question,
                    options,
                    answer
                });
                return newQuestion.save();
            });

            await Promise.all(questionPromises);
        });

        await Promise.all(quizPromises);

        console.log('Data seeded successfully');
    } catch (err) {
        console.error('Error seeding data:', err);
    }
};

app.listen(6000, async () => {
    console.log("server running: 6000");
    await connect();
    await createAdminUserIfNotExists();
    await seedData();
});