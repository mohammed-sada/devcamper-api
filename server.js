const express = require("express");
const morgan = require("morgan");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/error")

// Load env vars
require("dotenv").config({ path: "./config/config.env" });
require("colors");

// Route files
const bootcampsRouter = require("./routes/bootcamps.router")

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcampsRouter)

app.use(errorHandler) // We have to pass it after the router in order for the it to catch the error

const PORT = process.env.PORT || 5000;

async function startServer() {
    // Connect to DB
    await connectDb();

    const server = app.listen(PORT, console.log(`server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow))

    // Handle unhandled promise rejections
    // ex. DB connection failed
    process.on("unhandledRejection", (err, promise) => {
        console.log(`Error : ${err.message}`.red.bold)

        // close the server & exit process with failure(1)
        server.close(() => process.exit(1));
    })
}
startServer();
