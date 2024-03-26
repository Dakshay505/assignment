import { Document } from "mongoose";


export default interface UserDocument extends Document{
    rollNumber : string;
    name : string;
    email : string;
    password : string;
    role : "student" |"teacher";
    contactNumber : number;
    CVs : {
        fileUrl : string;
        uploadedDate : Date;
    }[]
    createdAt : Date;
    updatedAt : Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}