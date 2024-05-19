"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performTransaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("@src/database/models/userModel"));
const orderModel_1 = require("@src/database/models/orderModel");
const performTransaction = async () => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Example operation 1: Insert a document into the users collection
        const newUser = new userModel_1.default({ name: 'John willy', email: 'jo@example.com', role: "teacher", password: "1" });
        const userInsertResult = await newUser.save({ session });
        // Example operation 2: Insert a document into the orders collection
        const newOrder = new orderModel_1.OrderModel({ userId: userInsertResult._id, product: 'Laptop12', amount: 1200 });
        const orderInsertResult = await newOrder.save({ session });
        // Commit the transaction
        // const user1 = await UserModel.create({name: 'John Dill', email: 'n@example.com'});
        await session.commitTransaction();
        console.log('Transaction committed.');
    }
    catch (error) {
        console.error('Transaction aborted due to an error:', error);
        // Abort the transaction in case of an error
        await session.abortTransaction();
    }
    finally {
        session.endSession();
    }
};
exports.performTransaction = performTransaction;
