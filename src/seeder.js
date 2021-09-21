const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

require("colors");
require("dotenv").config();


// Load models
const Bootcamp = require("./models/bootcamps/bootcamps.mongo");
const Course = require("./models/courses/courses.mongo");
const User = require("./models/users/users.mongo");

// Connect DB
mongoose.connect(process.env.MONGO_URI);

// Import data into DB
async function importData() {
    try {
        // Read JSON files
        const bootcamps = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "_data", "bootcamps.json")));
        const courses = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "_data", "courses.json")));
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "_data", "users.json")));

        console.log("Importing Data...".green);
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log("Importing Data Completed 🔥".green.inverse);

        process.exit(0);
    } catch (err) {
        console.error(err);
    }
}

// Delete data
async function deleteData() {
    try {
        console.log("Deleting Data... ".red);
        await Bootcamp.deleteMany(); // Delete all of the docs
        await Course.deleteMany();
        await User.deleteMany();
        console.log("Deleting Data Completed 🔥".red.inverse);

        process.exit(0);
    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}