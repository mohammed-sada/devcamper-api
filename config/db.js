const mongoose = require("mongoose");

async function connectDb() {
    await mongoose.connect(process.env.MONGO_URI).then(conn => {
        console.log(`MongoDB Connected : ${conn.connection.host}`.cyan.underline.bold);
    })
}

module.exports = connectDb;