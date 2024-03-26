import { NextFunction, Request,Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import UserDocument from "@src/database/Entities/UserDocument";
import UserModel from "@src/database/models/userModel";

export interface CustomRequest extends Request{
    teacher ?: UserDocument;
    student ?: UserDocument;
}

export const isAuthenticated = async (
    req: CustomRequest,
    resp: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { token } = req.cookies;
  
    if (!token) {
      return resp.status(404).json({
        success: false,
        message: "Login first.",
      });
    };
    try {
      const decodedData: JwtPayload = jwt.verify(token, process.env.JWT_KEY as Secret) as JwtPayload;
      if (decodedData) {
        const user = await UserModel.findOne({_id : decodedData.user}).lean();
        if(user){
            if(user.role === "teacher"){
                req.teacher = user;
                next();
            }else{
                req.student = user;
                next();
            }
        }else{
            return resp.status(401).json({
                success: false,
                message: "Invalid token.",
              });
        }
      } else {
        return resp.status(401).json({
          success: false,
          message: "Invalid token.",
        });
      };
    } catch (error) {
      return resp.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    };
  };