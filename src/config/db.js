const mongoose = require("mongoose");

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected".cyan.underline.bold);
});
mongoose.connection.on("error", (err) => {
    console.error(err);
});

async function connectDb() {
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = connectDb;