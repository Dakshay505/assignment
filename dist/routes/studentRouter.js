"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentController_1 = require("@src/controllers/studentController");
const auth_1 = require("@src/middleware/auth");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Only .pdf files are allowed!'), false);
    }
};
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: pdfFilter,
});
const studentRouter = (0, express_1.Router)();
studentRouter.route("/updateUser").patch(auth_1.isAuthenticated, upload.single("file"), studentController_1.updateUser);
studentRouter.route("/getStudents").get(auth_1.isAuthenticated, studentController_1.getStudents);
studentRouter.route("/createStudentId").post(auth_1.isAuthenticated, studentController_1.createStudentId);
exports.default = studentRouter;
