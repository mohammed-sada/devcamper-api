const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ],
        required: [true, "Please add an email"]
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please add a password"],
        select: false // exclude password from the response
    },
    role: {
        type: String,
        enum: ["user", "publisher"],
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate and hash token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hash Token
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min 

    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
