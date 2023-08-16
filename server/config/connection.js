require('dotenv').config()
const mongoose = require('mongoose')
const DB_URI = process.env.DB_URI

const connection = () => {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("DataBase Connected");
    }).catch((err) => {
        console.log("database not connected");
        console.log(err);
    });

    mongoose.connection.on('connected', () => {
        console.log("Mongoose conneted to DB");
    })

    mongoose.connection.on('error', (err) => {
        console.log(err.message);
    })

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection is disconnected.')
    })

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0)
    })
}



module.exports = {connection};