import jwt,{Secret} from "jsonwebtoken"
import { Response } from "express";

export const sendCookie = async (
  resp: Response,
  user:any,
  message: string,
  statusCode = 200
) => {

  const token = jwt.sign({user:user._id} , process.env.JWT_KEY as Secret);
  return resp
    .status(statusCode)
    .cookie("token", token, {
      maxAge: 5 * 60 * 60 * 1000,
      httpOnly:true,
      secure: true, // Set to true if using HTTPS
      sameSite: "none", // Set the appropriate SameSite policy based on your requirements
    })
    .json({
      success: true,
      user,
      message,
      cookie:"Cookie saved successfully."
    });
};
