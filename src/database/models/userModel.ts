import { model } from "mongoose";
import UserDocument from "../Entities/UserDocument";
import userSchema from "../schemas/userSchema";

const UserModel = model<UserDocument>('User', userSchema);

export default UserModel;