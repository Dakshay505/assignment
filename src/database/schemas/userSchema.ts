import { Schema } from "mongoose";
import UserDocument from "../Entities/UserDocument";
import bcrypt from "bcrypt";

const userSchema = new Schema<UserDocument>({
  rollNumber: { type: String, unique: true },
  name: { type: String},
  email: {
    type: String,
    // unique: true,
    validate: {
      validator: (value: string) => {
        // Simple email validation
        return /\S+@\S+\.\S+/.test(value);
      },
      message: (props: any) => `${props.value} is not a valid email address!`,
    },
  },
  password: { type: String, required: true , select : false},
  role: { type: String, enum: ["student", "teacher"], required: true },
  contactNumber: { type: Number,  },
  CVs: [
    {
      fileUrl: { type: String, },
      uploadedDate: { type: Date, },
    },
  ],
},{timestamps : true});

// Hash password before saving
userSchema.pre<UserDocument>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    next();
  } catch (error: any) {
    return next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  
  return bcrypt.compare(candidatePassword, this.password);
};

export default userSchema;