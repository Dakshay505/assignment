"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = exports.NewUserModel = exports.db2 = exports.db1 = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.db1 = mongoose_1.default.createConnection('mongodb://localhost:27017/database1', {});
exports.db2 = mongoose_1.default.createConnection('mongodb://localhost:27017/database2', {});
const newUserSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
});
exports.NewUserModel = exports.db1.model('newUser', newUserSchema);
const productSchema = new mongoose_1.default.Schema({
    name: String,
    price: Number,
});
exports.ProductModel = exports.db2.model('Product', productSchema);
