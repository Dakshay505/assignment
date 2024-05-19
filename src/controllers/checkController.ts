import mongoose from 'mongoose';
import UserModel from '@src/database/models/userModel';
import { OrderModel } from '@src/database/models/orderModel';

export const performTransaction = async (): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Example operation 1: Insert a document into the users collection
    const newUser = new UserModel({ name: 'John willy', email: 'jo@example.com',role:"teacher",password: "1" });
    const userInsertResult = await newUser.save({ session });

    // Example operation 2: Insert a document into the orders collection
    const newOrder = new OrderModel({ userId: userInsertResult._id, product: 'Laptop12', amount: 1200 });
    const orderInsertResult = await newOrder.save({ session });

    // Commit the transaction
    // const user1 = await UserModel.create({name: 'John Dill', email: 'n@example.com'});
    await session.commitTransaction();
    console.log('Transaction committed.');
  } catch (error) {
    console.error('Transaction aborted due to an error:', error);
    // Abort the transaction in case of an error
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
};
