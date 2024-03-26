"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const studentRouter_1 = __importDefault(require("./routes/studentRouter"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", "public/.env") });
const FRONTEND_URI1 = process.env.FRONTEND_URI1;
const FRONTEND_URI2 = process.env.FRONTEND_URI2;
if (!FRONTEND_URI1 || !FRONTEND_URI2) {
    throw new Error("Missing FRONTEND_URI1 or FRONTEND_URI2 environment variables");
}
// middlewares
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "build")));
app.use((0, cors_1.default)({
    credentials: true,
    origin: [FRONTEND_URI1, FRONTEND_URI2],
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/student", studentRouter_1.default);
// adding build 
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "build", "index.html"));
});
app.use(errorHandler_1.errorMiddleware);
exports.default = app;
