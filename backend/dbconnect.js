const mongoose = require('mongoose');
const config = require('./config/database.js');

module.exports = async function connect() {
    try {
        mongoose.connect(
            config.mongoAtlasUri,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true 
            }, () => { 
                console.log("Mongoose is connected");
            },
        );
    } catch (e) {
        console.log("could not connect");
    }
    
    const dbConnection = mongoose.connection;
    dbConnection.on("error", (err) => {
        console.log(`Connection error ${err}`);
    });
    dbConnection.once("open", () => {
        console.log("Connected to DB!")
    });
}