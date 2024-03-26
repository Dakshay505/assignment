"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("@src/database/models/userModel"));
const isAuthenticated = async (req, resp, next) => {
    const { token } = req.cookies;
    if (!token) {
        return resp.status(404).json({
            success: false,
            message: "Login first.",
        });
    }
    ;
    try {
        const decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        if (decodedData) {
            const user = await userModel_1.default.findOne({ _id: decodedData.user }).lean();
            if (user) {
                if (user.role === "teacher") {
                    req.teacher = user;
                    next();
                }
                else {
                    req.student = user;
                    next();
                }
            }
            else {
                return resp.status(401).json({
                    success: false,
                    message: "Invalid token.",
                });
            }
        }
        else {
            return resp.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }
        ;
    }
    catch (error) {
        return resp.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
    ;
};
exports.isAuthenticated = isAuthenticated;
