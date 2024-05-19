import { Login, RegisterTeacher, getUser, logout } from "@src/controllers/authController";
import { performTransaction } from "@src/controllers/checkController";
import { NewUserModel } from "@src/database/connection/connectMultiple";
import { isAuthenticated } from "@src/middleware/auth";
import { Request, Response, Router } from "express";

const authRouter =Router();

authRouter.route('/perform-transaction').get(async (req: Request, res: Response) => {
    try {
      console.log("check");
      await performTransaction();
      res.send('Transaction performed successfully');
    } catch (error) {
      res.status(500).send('Error performing transaction');
    }
});
authRouter.route("/create").get(async (req,res,next)=>{
  try {
    const getUsers = await NewUserModel.find().lean();
    res.status(201).send(getUsers);
  } catch (error) {
    res.status(400).send(error);
  }
})

authRouter.route("/login").post(Login);
authRouter.route("/register").post(RegisterTeacher);
authRouter.route("/getUser").get(isAuthenticated,getUser);
authRouter.route("/logout").get(logout);

export default authRouter;