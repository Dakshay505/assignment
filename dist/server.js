"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const path_1 = __importDefault(require("path"));
const connect_1 = require("./database/connection/connect");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", "public/.env") });
const PORT = process.env.PORT || 5050;
app_1.default.listen(PORT, () => {
    (0, connect_1.connectDB)();
    console.log(`server is running on http://localhost${PORT}`);
});
