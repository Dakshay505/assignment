"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    rollNumber: { type: String, unique: true },
    name: { type: String },
    email: {
        type: String,
        // unique: true,
        validate: {
            validator: (value) => {
                // Simple email validation
                return /\S+@\S+\.\S+/.test(value);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "teacher"], required: true },
    contactNumber: { type: Number, },
    CVs: [
        {
            fileUrl: { type: String, },
            uploadedDate: { type: Date, },
        },
    ],
}, { timestamps: true });
// Hash password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password"))
        return next();
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt_1.default.hash(user.password, saltRounds);
        user.password = hashedPassword;
        next();
    }
    catch (error) {
        return next(error);
    }
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
exports.default = userSchema;
