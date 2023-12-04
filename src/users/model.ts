import mongoose from "mongoose";
import { Role, User } from "../types/user";

const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    required: true,
  },
  email_verified: {
    type: Boolean,
    default: false,
    trim: true,
  },
  phone_number: {
    type: String,
    trim: true,
    index: true,
    unique: true,
  },
  phone_number_verified: {
    type: Boolean,
    default: false,
    trim: true,
  },
  role: {
    type: String,
    default: Role.USER,
    trim: true,
  },
});

export const UserModel = mongoose.model<User>("User", UserSchema);
