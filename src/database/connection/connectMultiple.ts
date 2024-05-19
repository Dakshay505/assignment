import mongoose from "mongoose";

export const db1 = mongoose.createConnection('mongodb://localhost:27017/database1', {
});

export const db2 = mongoose.createConnection('mongodb://localhost:27017/database2', {
});

const newUserSchema = new mongoose.Schema({
    name: String,
    email: String,
  });

export const NewUserModel = db1.model('newUser', newUserSchema);

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
  });
  
export const ProductModel = db2.model('Product', productSchema);
