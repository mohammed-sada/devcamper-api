const express = require("express");
const morgan = require("morgan");

// Load env vars
require("dotenv").config({ path: "./config/config.env" });

// Route files
const bootcampsRouter = require("./routes/bootcamps")

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcampsRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server listening in ${process.env.NODE_ENV} mode on port ${PORT}`))