import { createStudentId, getStudents, updateUser } from "@src/controllers/studentController";
import { isAuthenticated } from "@src/middleware/auth";
import { Request, Router } from "express";
import multer from "multer";

const pdfFilter = (req:Request, file:any, cb:any) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf files are allowed!'), false);
    }
  };

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: pdfFilter,
});

const studentRouter = Router();

studentRouter.route("/updateUser").patch(isAuthenticated,upload.single("file"),updateUser);
studentRouter.route("/getStudents").get(isAuthenticated,getStudents);
studentRouter.route("/createStudentId").post(isAuthenticated,createStudentId);


export default studentRouter;