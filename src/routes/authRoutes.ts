import { Login, RegisterTeacher, getUser, logout } from "@src/controllers/authController";
import { isAuthenticated } from "@src/middleware/auth";
import { Router } from "express";

const authRouter =Router();

authRouter.route("/login").post(Login);
authRouter.route("/register").post(RegisterTeacher);
authRouter.route("/getUser").get(isAuthenticated,getUser);
authRouter.route("/logout").get(logout);

export default authRouter;