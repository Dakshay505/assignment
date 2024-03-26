"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getUser = exports.RegisterTeacher = exports.Login = void 0;
const userModel_1 = __importDefault(require("@src/database/models/userModel"));
const errorHandler_1 = __importDefault(require("@src/middleware/errorHandler"));
const catchErrorAsync_1 = __importDefault(require("@src/utils/catchErrorAsync"));
const sendCookie_1 = require("@src/utils/sendCookie");
exports.Login = (0, catchErrorAsync_1.default)(async (req, resp, next) => {
    const { email, password } = req.body;
    let user = await userModel_1.default.findOne({ $or: [{ rollNumber: email }, { email }] }).select("+password");
    if (!user)
        return next(new errorHandler_1.default("User or password doesn't match", 403));
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new Error('Invalid credentials');
    }
    (0, sendCookie_1.sendCookie)(resp, user, "Login successfull.", 200);
});
exports.RegisterTeacher = (0, catchErrorAsync_1.default)(async (req, resp, next) => {
    const { name, email, password } = req.body;
    const user = await userModel_1.default.findOne({ email: email.toLowerCase() });
    if (user)
        return next(new errorHandler_1.default("User already present with same Email address.", 400));
    console.log("body", req.body);
    const newUser = await userModel_1.default.create({ name, email: email.toLowerCase(), password, role: "teacher" });
    console.log(newUser);
    (0, sendCookie_1.sendCookie)(resp, newUser, "User Created successFully.", 201);
});
exports.getUser = (0, catchErrorAsync_1.default)(async (req, resp, next) => {
    if (req.teacher) {
        resp.status(200).json({
            success: true,
            message: "Getting data successfully.",
            user: req.teacher
        });
    }
    else if (req.student) {
        resp.status(200).json({
            success: true,
            message: "Getting data successfully.",
            user: { ...req.student, pdfFileUrl: req.student.CVs[req.student?.CVs?.length - 1 || 0]?.fileUrl || "" }
        });
    }
    else {
        return next(new errorHandler_1.default("Login first", 403));
    }
});
exports.logout = (0, catchErrorAsync_1.default)(async (req, resp, next) => {
    resp
        .status(200)
        .cookie("token", "", {
        expires: new Date(Date.now()),
    })
        .json({
        success: true,
        message: "User logged out successfully",
    });
});
