import UserDocument from "@src/database/Entities/UserDocument";
import UserModel from "@src/database/models/userModel";
import { CustomRequest } from "@src/middleware/auth";
import ErrorHandler from "@src/middleware/errorHandler";
import catchErrorAsync from "@src/utils/catchErrorAsync";
import { sendCookie } from "@src/utils/sendCookie";
import { NextFunction, Request, Response } from "express";

export const Login = catchErrorAsync(async (req:Request,resp:Response,next:NextFunction)=>{
    const { email, password } = req.body;

        let user = await UserModel.findOne({$or : [ {rollNumber : email},{email}] }).select("+password");

        if (!user) return next(new ErrorHandler("User or password doesn't match",403));
        
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            throw new Error('Invalid credentials');
        }
        sendCookie(resp,user,"Login successfull.",200);
});


export const RegisterTeacher = catchErrorAsync(async (req:Request,resp:Response,next:NextFunction)=>{
     
    const  {name,email,password} = req.body;
    
    const user  = await UserModel.findOne({email : email.toLowerCase()});
    if(user) return next(new ErrorHandler("User already present with same Email address.",400)); 
    console.log("body",req.body);
    const newUser = await UserModel.create({name,email : email.toLowerCase(),password,role : "teacher"});
    console.log(newUser);
    sendCookie(resp,newUser,"User Created successFully.",201);
});


export const getUser = catchErrorAsync(async (req:CustomRequest,resp:Response,next:NextFunction)=>{
     if(req.teacher){
       resp.status(200).json({
        success:true,
        message : "Getting data successfully.",
        user : req.teacher
       })
     }else if(req.student){
        resp.status(200).json({
            success:true,
            message : "Getting data successfully.",
            user : {...req.student,pdfFileUrl : req.student.CVs[req.student?.CVs?.length-1 || 0]?.fileUrl || ""}
           });
     }else{
        return next(new ErrorHandler("Login first",403));
     }
});

export const logout = catchErrorAsync(
    async (req: Request, resp: Response, next: NextFunction) => {
      resp
        .status(200)
        .cookie("token", "", {
          expires: new Date(Date.now()),
        })
        .json({
          success: true,
          message: "User logged out successfully",
        });
    }
  );