import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  product: string;
  amount: number;
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
});

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
