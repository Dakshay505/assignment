"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendCookie = async (resp, user, message, statusCode = 200) => {
    const token = jsonwebtoken_1.default.sign({ user: user._id }, process.env.JWT_KEY);
    return resp
        .status(statusCode)
        .cookie("token", token, {
        maxAge: 5 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none", // Set the appropriate SameSite policy based on your requirements
    })
        .json({
        success: true,
        user,
        message,
        cookie: "Cookie saved successfully."
    });
};
exports.sendCookie = sendCookie;
