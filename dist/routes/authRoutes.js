"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("@src/controllers/authController");
const checkController_1 = require("@src/controllers/checkController");
const connectMultiple_1 = require("@src/database/connection/connectMultiple");
const auth_1 = require("@src/middleware/auth");
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.route('/perform-transaction').get(async (req, res) => {
    try {
        console.log("check");
        await (0, checkController_1.performTransaction)();
        res.send('Transaction performed successfully');
    }
    catch (error) {
        res.status(500).send('Error performing transaction');
    }
});
authRouter.route("/create").get(async (req, res, next) => {
    try {
        const getUsers = await connectMultiple_1.NewUserModel.find().lean();
        res.status(201).send(getUsers);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
authRouter.route("/login").post(authController_1.Login);
authRouter.route("/register").post(authController_1.RegisterTeacher);
authRouter.route("/getUser").get(auth_1.isAuthenticated, authController_1.getUser);
authRouter.route("/logout").get(authController_1.logout);
exports.default = authRouter;
