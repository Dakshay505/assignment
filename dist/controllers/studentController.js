"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentId = exports.getStudents = exports.updateUser = void 0;
const userModel_1 = __importDefault(require("@src/database/models/userModel"));
const errorHandler_1 = __importDefault(require("@src/middleware/errorHandler"));
const catchErrorAsync_1 = __importDefault(require("@src/utils/catchErrorAsync"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import {v2 as cloudinary} from 'cloudinary';
const uuid_1 = require("uuid");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", "public/.env") });
// cloudinary.config({ 
//   cloud_name: 'dy244ctnbs', 
//   api_key: '2459714744155188', 
//   api_secret: 'JvSWgRwMYsPEP2zBQx2lmdDVSNh0'  
// });
console.log(process.env.PORT);
aws_sdk_1.default.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
if (!BUCKET) {
    console.error("No bucket specified in the environment configuration.");
    process.exit(1); // Exit the application or handle the error accordingly
}
const s3 = new aws_sdk_1.default.S3();
exports.updateUser = (0, catchErrorAsync_1.default)(async (req, resp, next) => {
    const { name, email, password, contactNumber, _id } = req.body;
    const user = await userModel_1.default.findById(_id);
    if (!user)
        return next(new errorHandler_1.default("User not found.", 404));
    console.log(user);
    if (name) {
        user.name = name;
    }
    if (email) {
        const check = await userModel_1.default.find({ email });
        if (check && (email !== user.email)) {
            return next(new errorHandler_1.default("Email already used.", 404));
        }
        user.email = email.toLowerCase();
    }
    if (password) {
        user.password = password;
    }
    if (contactNumber) {
        user.contactNumber = contactNumber;
    }
    if (req.file) {
        // const uploadResult = cloudinary.uploader.upload_stream({
        //     resource_type: 'raw'
        //   }, (error, result) => {
        //     if (error) return next(error);
        //     return result;
        //   }).end(req.file.buffer);
        //   console.log(uploadResult);
        let fileUrl = "";
        const file = req.file;
        const fileKey = `uploads/${(0, uuid_1.v4)()}-${file.originalname}`;
        const uploadParams = {
            Bucket: BUCKET,
            Key: fileKey,
            Body: file.buffer,
            ACL: "public-read",
        };
        await s3.putObject(uploadParams).promise();
        fileUrl = `https://${BUCKET}.s3.amazonaws.com/${fileKey}`;
        //   console.log(fileUrl);
        user.CVs.push({ fileUrl, uploadedDate: new Date() });
    }
    await user.save();
    return resp.status(200).json({
        success: true,
        message: "updated successfully.",
        user
    });
});
exports.getStudents = (0, catchErrorAsync_1.default)(async (req, resp, next) => {
    if (req.teacher) {
        const getAllStudents = await userModel_1.default.find({ role: "student" }).lean();
        const result = [];
        getAllStudents.forEach((g) => {
            result.push({
                name: g?.name || "",
                email: g?.email || "",
                contactNumber: g?.contactNumber,
                rollNumber: g?.rollNumber || "",
                fileUrl: g.CVs[g.CVs?.length - 1]?.fileUrl || "",
                uploadedDate: g.CVs[g.CVs?.length - 1]?.uploadedDate || "",
            });
        });
        resp.status(200).json({
            success: true,
            message: "Getting data successfully.",
            data: result
        });
    }
    else {
        return next(new errorHandler_1.default("Not authorized.", 403));
    }
});
exports.createStudentId = (0, catchErrorAsync_1.default)(async (req, resp, next) => {
    if (req.teacher) {
        const { rollNumber } = req.body;
        const check = await userModel_1.default.findOne({ rollNumber });
        if (check)
            return next(new errorHandler_1.default("Please select valid rollNumber.", 400));
        const studentId = await userModel_1.default.create({ rollNumber, password: rollNumber, role: "student" });
        resp.status(201).json({
            success: true,
            message: "Id created successfully.",
            data: studentId
        });
    }
    else {
        return next(new errorHandler_1.default("Not authorized.", 403));
    }
});
