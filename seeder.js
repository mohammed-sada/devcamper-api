const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

require("colors");
require("dotenv").config({ path: "./src/config/config.env" });

// Load models
const Bootcamp = require("./src/models/bootcamps/bootcamps.mongo");

// Connect DB
mongoose.connect(process.env.MONGO_URI);

// Import data into DB
async function importData() {
    try {
        // Read JSON files
        const bootcamps = JSON.parse(fs.readFileSync(path.join(__dirname, "_data", "bootcamps.json")));

        console.log("Importing Data...".green.inverse);
        await Bootcamp.create(bootcamps);
        console.log("Importing Data Completed 🔥".green.inverse);

        process.exit(0);
    } catch (err) {
        console.error(err);
    }
}

// Delete data
async function deleteData() {
    try {
        console.log("Deleting Data... ".red.inverse);
        await Bootcamp.deleteMany(); // Delete all of the docs
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