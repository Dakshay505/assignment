/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\nconst cors_1 = __importDefault(__webpack_require__(/*! cors */ \"cors\"));\nconst cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ \"cookie-parser\"));\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\nconst errorHandler_1 = __webpack_require__(/*! ./middleware/errorHandler */ \"./src/middleware/errorHandler.ts\");\nconst authRoutes_1 = __importDefault(__webpack_require__(/*! ./routes/authRoutes */ \"./src/routes/authRoutes.ts\"));\nconst studentRouter_1 = __importDefault(__webpack_require__(/*! ./routes/studentRouter */ \"./src/routes/studentRouter.ts\"));\nconst app = (0, express_1.default)();\ndotenv_1.default.config({ path: path_1.default.join(__dirname, \"..\", \"public/.env\") });\nconst FRONTEND_URI1 = process.env.FRONTEND_URI1;\nconst FRONTEND_URI2 = process.env.FRONTEND_URI2;\nif (!FRONTEND_URI1 || !FRONTEND_URI2) {\n    throw new Error(\"Missing FRONTEND_URI1 or FRONTEND_URI2 environment variables\");\n}\n// middlewares\napp.use(express_1.default.json({ limit: \"10mb\" }));\napp.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));\napp.use(express_1.default.static(path_1.default.join(__dirname, \"..\", \"build\")));\napp.use((0, cors_1.default)({\n    credentials: true,\n    origin: [FRONTEND_URI1, FRONTEND_URI2],\n}));\napp.use((0, cookie_parser_1.default)());\napp.use(\"/api/v1/auth\", authRoutes_1.default);\napp.use(\"/api/v1/student\", studentRouter_1.default);\n// adding build \napp.get(\"*\", (req, res) => {\n    res.sendFile(path_1.default.join(__dirname, \"..\", \"build\", \"index.html\"));\n});\napp.use(errorHandler_1.errorMiddleware);\nexports[\"default\"] = app;\n\n\n//# sourceURL=webpack://taskBackend/./src/app.ts?");

/***/ }),

/***/ "./src/controllers/authController.ts":
/*!*******************************************!*\
  !*** ./src/controllers/authController.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.logout = exports.getUser = exports.RegisterTeacher = exports.Login = void 0;\nconst userModel_1 = __importDefault(__webpack_require__(/*! @src/database/models/userModel */ \"./src/database/models/userModel.ts\"));\nconst errorHandler_1 = __importDefault(__webpack_require__(/*! @src/middleware/errorHandler */ \"./src/middleware/errorHandler.ts\"));\nconst catchErrorAsync_1 = __importDefault(__webpack_require__(/*! @src/utils/catchErrorAsync */ \"./src/utils/catchErrorAsync.ts\"));\nconst sendCookie_1 = __webpack_require__(/*! @src/utils/sendCookie */ \"./src/utils/sendCookie.ts\");\nexports.Login = (0, catchErrorAsync_1.default)(async (req, resp, next) => {\n    const { email, password } = req.body;\n    let user = await userModel_1.default.findOne({ $or: [{ rollNumber: email }, { email }] }).select(\"+password\");\n    if (!user)\n        return next(new errorHandler_1.default(\"User or password doesn't match\", 403));\n    const isPasswordMatch = await user.comparePassword(password);\n    if (!isPasswordMatch) {\n        throw new Error('Invalid credentials');\n    }\n    (0, sendCookie_1.sendCookie)(resp, user, \"Login successfull.\", 200);\n});\nexports.RegisterTeacher = (0, catchErrorAsync_1.default)(async (req, resp, next) => {\n    const { name, email, password } = req.body;\n    const user = await userModel_1.default.findOne({ email: email.toLowerCase() });\n    if (user)\n        return next(new errorHandler_1.default(\"User already present with same Email address.\", 400));\n    console.log(\"body\", req.body);\n    const newUser = await userModel_1.default.create({ name, email: email.toLowerCase(), password, role: \"teacher\" });\n    console.log(newUser);\n    (0, sendCookie_1.sendCookie)(resp, newUser, \"User Created successFully.\", 201);\n});\nexports.getUser = (0, catchErrorAsync_1.default)(async (req, resp, next) => {\n    if (req.teacher) {\n        resp.status(200).json({\n            success: true,\n            message: \"Getting data successfully.\",\n            user: req.teacher\n        });\n    }\n    else if (req.student) {\n        resp.status(200).json({\n            success: true,\n            message: \"Getting data successfully.\",\n            user: { ...req.student, pdfFileUrl: req.student.CVs[req.student?.CVs?.length - 1 || 0]?.fileUrl || \"\" }\n        });\n    }\n    else {\n        return next(new errorHandler_1.default(\"Login first\", 403));\n    }\n});\nexports.logout = (0, catchErrorAsync_1.default)(async (req, resp, next) => {\n    resp\n        .status(200)\n        .cookie(\"token\", \"\", {\n        expires: new Date(Date.now()),\n    })\n        .json({\n        success: true,\n        message: \"User logged out successfully\",\n    });\n});\n\n\n//# sourceURL=webpack://taskBackend/./src/controllers/authController.ts?");

/***/ }),

/***/ "./src/controllers/studentController.ts":
/*!**********************************************!*\
  !*** ./src/controllers/studentController.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.createStudentId = exports.getStudents = exports.updateUser = void 0;\nconst userModel_1 = __importDefault(__webpack_require__(/*! @src/database/models/userModel */ \"./src/database/models/userModel.ts\"));\nconst errorHandler_1 = __importDefault(__webpack_require__(/*! @src/middleware/errorHandler */ \"./src/middleware/errorHandler.ts\"));\nconst catchErrorAsync_1 = __importDefault(__webpack_require__(/*! @src/utils/catchErrorAsync */ \"./src/utils/catchErrorAsync.ts\"));\nconst aws_sdk_1 = __importDefault(__webpack_require__(/*! aws-sdk */ \"aws-sdk\"));\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\n// import {v2 as cloudinary} from 'cloudinary';\nconst uuid_1 = __webpack_require__(/*! uuid */ \"uuid\");\ndotenv_1.default.config({ path: path_1.default.join(__dirname, \"..\", \"public/.env\") });\n// cloudinary.config({ \n//   cloud_name: 'dy244ctnbs', \n//   api_key: '2459714744155188', \n//   api_secret: 'JvSWgRwMYsPEP2zBQx2lmdDVSNh0'  \n// });\nconsole.log(process.env.PORT);\naws_sdk_1.default.config.update({\n    secretAccessKey: process.env.ACCESS_SECRET,\n    accessKeyId: process.env.ACCESS_KEY,\n    region: process.env.REGION,\n});\nconst BUCKET = process.env.BUCKET;\nif (!BUCKET) {\n    console.error(\"No bucket specified in the environment configuration.\");\n    process.exit(1); // Exit the application or handle the error accordingly\n}\nconst s3 = new aws_sdk_1.default.S3();\nexports.updateUser = (0, catchErrorAsync_1.default)(async (req, resp, next) => {\n    const { name, email, password, contactNumber, _id } = req.body;\n    const user = await userModel_1.default.findById(_id);\n    if (!user)\n        return next(new errorHandler_1.default(\"User not found.\", 404));\n    console.log(user);\n    if (name) {\n        user.name = name;\n    }\n    if (email) {\n        const check = await userModel_1.default.find({ email });\n        if (check && (email !== user.email)) {\n            return next(new errorHandler_1.default(\"Email already used.\", 404));\n        }\n        user.email = email.toLowerCase();\n    }\n    if (password) {\n        user.password = password;\n    }\n    if (contactNumber) {\n        user.contactNumber = contactNumber;\n    }\n    if (req.file) {\n        // const uploadResult = cloudinary.uploader.upload_stream({\n        //     resource_type: 'raw'\n        //   }, (error, result) => {\n        //     if (error) return next(error);\n        //     return result;\n        //   }).end(req.file.buffer);\n        //   console.log(uploadResult);\n        let fileUrl = \"\";\n        const file = req.file;\n        const fileKey = `uploads/${(0, uuid_1.v4)()}-${file.originalname}`;\n        const uploadParams = {\n            Bucket: BUCKET,\n            Key: fileKey,\n            Body: file.buffer,\n            ACL: \"public-read\",\n        };\n        await s3.putObject(uploadParams).promise();\n        fileUrl = `https://${BUCKET}.s3.amazonaws.com/${fileKey}`;\n        //   console.log(fileUrl);\n        user.CVs.push({ fileUrl, uploadedDate: new Date() });\n    }\n    await user.save();\n    return resp.status(200).json({\n        success: true,\n        message: \"updated successfully.\",\n        user\n    });\n});\nexports.getStudents = (0, catchErrorAsync_1.default)(async (req, resp, next) => {\n    if (req.teacher) {\n        const getAllStudents = await userModel_1.default.find({ role: \"student\" }).lean();\n        const result = [];\n        getAllStudents.forEach((g) => {\n            result.push({\n                name: g?.name || \"\",\n                email: g?.email || \"\",\n                contactNumber: g?.contactNumber,\n                rollNumber: g?.rollNumber || \"\",\n                fileUrl: g.CVs[g.CVs?.length - 1]?.fileUrl || \"\",\n                uploadedDate: g.CVs[g.CVs?.length - 1]?.uploadedDate || \"\",\n            });\n        });\n        resp.status(200).json({\n            success: true,\n            message: \"Getting data successfully.\",\n            data: result\n        });\n    }\n    else {\n        return next(new errorHandler_1.default(\"Not authorized.\", 403));\n    }\n});\nexports.createStudentId = (0, catchErrorAsync_1.default)(async (req, resp, next) => {\n    if (req.teacher) {\n        const { rollNumber } = req.body;\n        const check = await userModel_1.default.findOne({ rollNumber });\n        if (check)\n            return next(new errorHandler_1.default(\"Please select valid rollNumber.\", 400));\n        const studentId = await userModel_1.default.create({ rollNumber, password: rollNumber, role: \"student\" });\n        resp.status(201).json({\n            success: true,\n            message: \"Id created successfully.\",\n            data: studentId\n        });\n    }\n    else {\n        return next(new errorHandler_1.default(\"Not authorized.\", 403));\n    }\n});\n\n\n//# sourceURL=webpack://taskBackend/./src/controllers/studentController.ts?");

/***/ }),

/***/ "./src/database/connection/connect.ts":
/*!********************************************!*\
  !*** ./src/database/connection/connect.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.connectDB = void 0;\nconst mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ \"mongoose\"));\nconst connectDB = async () => {\n    try {\n        const connect = await mongoose_1.default.connect(`${process.env.DB_URI}`);\n        console.log(\"DB connected\");\n        return connect;\n    }\n    catch (err) {\n        console.log(err.message);\n    }\n};\nexports.connectDB = connectDB;\n\n\n//# sourceURL=webpack://taskBackend/./src/database/connection/connect.ts?");

/***/ }),

/***/ "./src/database/models/userModel.ts":
/*!******************************************!*\
  !*** ./src/database/models/userModel.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst userSchema_1 = __importDefault(__webpack_require__(/*! ../schemas/userSchema */ \"./src/database/schemas/userSchema.ts\"));\nconst UserModel = (0, mongoose_1.model)('User', userSchema_1.default);\nexports[\"default\"] = UserModel;\n\n\n//# sourceURL=webpack://taskBackend/./src/database/models/userModel.ts?");

/***/ }),

/***/ "./src/database/schemas/userSchema.ts":
/*!********************************************!*\
  !*** ./src/database/schemas/userSchema.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst bcrypt_1 = __importDefault(__webpack_require__(/*! bcrypt */ \"bcrypt\"));\nconst userSchema = new mongoose_1.Schema({\n    rollNumber: { type: String },\n    name: { type: String },\n    email: {\n        type: String,\n        // unique: true,\n        validate: {\n            validator: (value) => {\n                // Simple email validation\n                return /\\S+@\\S+\\.\\S+/.test(value);\n            },\n            message: (props) => `${props.value} is not a valid email address!`,\n        },\n    },\n    password: { type: String, required: true, select: false },\n    role: { type: String, enum: [\"student\", \"teacher\"], required: true },\n    contactNumber: { type: Number, },\n    CVs: [\n        {\n            fileUrl: { type: String, },\n            uploadedDate: { type: Date, },\n        },\n    ],\n}, { timestamps: true });\n// Hash password before saving\nuserSchema.pre(\"save\", async function (next) {\n    const user = this;\n    if (!user.isModified(\"password\"))\n        return next();\n    const saltRounds = 10;\n    try {\n        const hashedPassword = await bcrypt_1.default.hash(user.password, saltRounds);\n        user.password = hashedPassword;\n        next();\n    }\n    catch (error) {\n        return next(error);\n    }\n});\n// Method to compare passwords\nuserSchema.methods.comparePassword = async function (candidatePassword) {\n    return bcrypt_1.default.compare(candidatePassword, this.password);\n};\nexports[\"default\"] = userSchema;\n\n\n//# sourceURL=webpack://taskBackend/./src/database/schemas/userSchema.ts?");

/***/ }),

/***/ "./src/middleware/auth.ts":
/*!********************************!*\
  !*** ./src/middleware/auth.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.isAuthenticated = void 0;\nconst jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\"));\nconst userModel_1 = __importDefault(__webpack_require__(/*! @src/database/models/userModel */ \"./src/database/models/userModel.ts\"));\nconst isAuthenticated = async (req, resp, next) => {\n    const { token } = req.cookies;\n    if (!token) {\n        return resp.status(404).json({\n            success: false,\n            message: \"Login first.\",\n        });\n    }\n    ;\n    try {\n        const decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);\n        if (decodedData) {\n            const user = await userModel_1.default.findOne({ _id: decodedData.user }).lean();\n            if (user) {\n                if (user.role === \"teacher\") {\n                    req.teacher = user;\n                    next();\n                }\n                else {\n                    req.student = user;\n                    next();\n                }\n            }\n            else {\n                return resp.status(401).json({\n                    success: false,\n                    message: \"Invalid token.\",\n                });\n            }\n        }\n        else {\n            return resp.status(401).json({\n                success: false,\n                message: \"Invalid token.\",\n            });\n        }\n        ;\n    }\n    catch (error) {\n        return resp.status(401).json({\n            success: false,\n            message: \"Invalid token.\",\n        });\n    }\n    ;\n};\nexports.isAuthenticated = isAuthenticated;\n\n\n//# sourceURL=webpack://taskBackend/./src/middleware/auth.ts?");

/***/ }),

/***/ "./src/middleware/errorHandler.ts":
/*!****************************************!*\
  !*** ./src/middleware/errorHandler.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.errorMiddleware = void 0;\nclass ErrorHandler extends Error {\n    statusCode;\n    constructor(message, statusCode) {\n        super(message);\n        this.statusCode = statusCode;\n    }\n    ;\n}\n;\nconst errorMiddleware = (err, req, resp, next) => {\n    return resp.status(err.statusCode || 400).json({\n        success: false,\n        message: err.message,\n    });\n};\nexports.errorMiddleware = errorMiddleware;\nexports[\"default\"] = ErrorHandler;\n\n\n//# sourceURL=webpack://taskBackend/./src/middleware/errorHandler.ts?");

/***/ }),

/***/ "./src/routes/authRoutes.ts":
/*!**********************************!*\
  !*** ./src/routes/authRoutes.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst authController_1 = __webpack_require__(/*! @src/controllers/authController */ \"./src/controllers/authController.ts\");\nconst auth_1 = __webpack_require__(/*! @src/middleware/auth */ \"./src/middleware/auth.ts\");\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst authRouter = (0, express_1.Router)();\nauthRouter.route(\"/login\").post(authController_1.Login);\nauthRouter.route(\"/register\").post(authController_1.RegisterTeacher);\nauthRouter.route(\"/getUser\").get(auth_1.isAuthenticated, authController_1.getUser);\nauthRouter.route(\"/logout\").get(authController_1.logout);\nexports[\"default\"] = authRouter;\n\n\n//# sourceURL=webpack://taskBackend/./src/routes/authRoutes.ts?");

/***/ }),

/***/ "./src/routes/studentRouter.ts":
/*!*************************************!*\
  !*** ./src/routes/studentRouter.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst studentController_1 = __webpack_require__(/*! @src/controllers/studentController */ \"./src/controllers/studentController.ts\");\nconst auth_1 = __webpack_require__(/*! @src/middleware/auth */ \"./src/middleware/auth.ts\");\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst multer_1 = __importDefault(__webpack_require__(/*! multer */ \"multer\"));\nconst pdfFilter = (req, file, cb) => {\n    if (file.mimetype === 'application/pdf') {\n        cb(null, true);\n    }\n    else {\n        cb(new Error('Only .pdf files are allowed!'), false);\n    }\n};\nconst storage = multer_1.default.memoryStorage();\nconst upload = (0, multer_1.default)({\n    storage: storage,\n    fileFilter: pdfFilter,\n});\nconst studentRouter = (0, express_1.Router)();\nstudentRouter.route(\"/updateUser\").patch(auth_1.isAuthenticated, upload.single(\"file\"), studentController_1.updateUser);\nstudentRouter.route(\"/getStudents\").get(auth_1.isAuthenticated, studentController_1.getStudents);\nstudentRouter.route(\"/createStudentId\").post(auth_1.isAuthenticated, studentController_1.createStudentId);\nexports[\"default\"] = studentRouter;\n\n\n//# sourceURL=webpack://taskBackend/./src/routes/studentRouter.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\nconst app_1 = __importDefault(__webpack_require__(/*! ./app */ \"./src/app.ts\"));\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\nconst connect_1 = __webpack_require__(/*! ./database/connection/connect */ \"./src/database/connection/connect.ts\");\ndotenv_1.default.config({ path: path_1.default.join(__dirname, \"..\", \"public/.env\") });\nconst PORT = process.env.PORT || 5050;\napp_1.default.listen(PORT, () => {\n    (0, connect_1.connectDB)();\n    console.log(`server is running on http://localhost${PORT}`);\n});\n\n\n//# sourceURL=webpack://taskBackend/./src/server.ts?");

/***/ }),

/***/ "./src/utils/catchErrorAsync.ts":
/*!**************************************!*\
  !*** ./src/utils/catchErrorAsync.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst catchErrorAsync = (func) => (req, resp, next) => {\n    Promise.resolve(func(req, resp, next)).catch(next);\n};\nexports[\"default\"] = catchErrorAsync;\n\n\n//# sourceURL=webpack://taskBackend/./src/utils/catchErrorAsync.ts?");

/***/ }),

/***/ "./src/utils/sendCookie.ts":
/*!*********************************!*\
  !*** ./src/utils/sendCookie.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.sendCookie = void 0;\nconst jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\"));\nconst sendCookie = async (resp, user, message, statusCode = 200) => {\n    const token = jsonwebtoken_1.default.sign({ user: user._id }, process.env.JWT_KEY);\n    return resp\n        .status(statusCode)\n        .cookie(\"token\", token, {\n        maxAge: 5 * 60 * 60 * 1000,\n        httpOnly: true,\n        secure: true,\n        sameSite: \"none\", // Set the appropriate SameSite policy based on your requirements\n    })\n        .json({\n        success: true,\n        user,\n        message,\n        cookie: \"Cookie saved successfully.\"\n    });\n};\nexports.sendCookie = sendCookie;\n\n\n//# sourceURL=webpack://taskBackend/./src/utils/sendCookie.ts?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server.ts");
/******/ 	
/******/ })()
;