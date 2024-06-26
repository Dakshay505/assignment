"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("@src/controllers/authController");
const auth_1 = require("@src/middleware/auth");
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.route("/login").post(authController_1.Login);
authRouter.route("/register").post(authController_1.RegisterTeacher);
authRouter.route("/getUser").get(auth_1.isAuthenticated, authController_1.getUser);
exports.default = authRouter;
