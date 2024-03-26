import UserModel from "@src/database/models/userModel";
import { CustomRequest } from "@src/middleware/auth";
import ErrorHandler from "@src/middleware/errorHandler";
import catchErrorAsync from "@src/utils/catchErrorAsync";
import aws, { S3 } from "aws-sdk";
import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import path from "path";
// import {v2 as cloudinary} from 'cloudinary';
import { v4 as uuidv4 } from "uuid";
dotenv.config({path:path.join(__dirname, "..", "public/.env")})       
// cloudinary.config({ 
//   cloud_name: 'dy244ctnbs', 
//   api_key: '2459714744155188', 
//   api_secret: 'JvSWgRwMYsPEP2zBQx2lmdDVSNh0'  
// });
console.log(process.env.PORT);

aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET, 
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
  });
  const BUCKET = process.env.BUCKET;
  if (!BUCKET) {
    console.error("No bucket specified in the environment configuration.");
    process.exit(1); // Exit the application or handle the error accordingly
  }
  const s3 = new aws.S3();

export const updateUser = catchErrorAsync(async (req,resp,next)=>{

    const {name,email,password,contactNumber ,_id} = req.body;
   
    const user = await UserModel.findById(_id);
    if(!user)return next(new ErrorHandler("User not found.",404));
    console.log(user);
    if(name){
        user.name =name;
    }
    if(email){
        const check = await UserModel.find({email});
        if(check && (email !== user.email)){
            return next(new ErrorHandler("Email already used.",404))
        }
        user.email = email.toLowerCase();
    }
    if(password){
        user.password = password;
    }
    if(contactNumber){
        user.contactNumber = contactNumber;
    }
    if(req.file){
    
        // const uploadResult = cloudinary.uploader.upload_stream({
        //     resource_type: 'raw'
        //   }, (error, result) => {
        //     if (error) return next(error);
        //     return result;
        //   }).end(req.file.buffer);

        //   console.log(uploadResult);
 
      let fileUrl = "";
      const file = req.file;
      const fileKey = `uploads/${uuidv4()}-${file.originalname}`;
      const uploadParams: S3.PutObjectRequest = {
        Bucket: BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ACL: "public-read",
      };
      await s3.putObject(uploadParams).promise();
      fileUrl = `https://${BUCKET}.s3.amazonaws.com/${fileKey}`;
    //   console.log(fileUrl);
      user.CVs.push({fileUrl,uploadedDate:new Date()})
    }

    await user.save();
   
    return resp.status(200).json({
        success:true,
        message : "updated successfully.",
        user
    })
    
});


export const getStudents = catchErrorAsync(async (req : CustomRequest,resp:Response,next:NextFunction)=>{
     if(req.teacher){
        const getAllStudents = await UserModel.find({role:"student"}).lean();
        
        const result:{
            name : string;
            email:string;
            contactNumber :number;
            rollNumber : string;
            fileUrl : string;
            uploadedDate : Date | ""
        }[] = [];

        getAllStudents.forEach((g)=>{
          result.push({
            name : g?.name || "",
            email : g?.email || "",
            contactNumber : g?.contactNumber,
            rollNumber : g?.rollNumber || "",
            fileUrl : g.CVs[g.CVs?.length-1]?.fileUrl || "",
            uploadedDate :  g.CVs[g.CVs?.length-1]?.uploadedDate || "",
          })
        })

        resp.status(200).json({
            success : true,
            message : "Getting data successfully.",
            data : result
        })
     }else{
        return next(new ErrorHandler("Not authorized.",403));
     }
});

export const createStudentId = catchErrorAsync(async (req : CustomRequest,resp:Response,next:NextFunction)=>{
    if(req.teacher){
       const {rollNumber} = req.body;
        const studentId = await UserModel.create({rollNumber,password:rollNumber,role:"student"});
        resp.status(201).json({
            success : true,
            message : "Id created successfully.",
            data : studentId
        })
     }else{
        return next(new ErrorHandler("Not authorized.",403));
     }
})