import mongoose from 'mongoose';

export interface User {
    _id: string;
    name: string;
    email: string;
    email_verified: boolean;
    phone_number?: string;
    phone_number_verified?: boolean;
    role: string;
}

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
        trim: true
    },
    phone_number: {
        type: String,
        trim: true,
        index: true,
        // unique: true,
        //TODO: uncomment unique
    },
    phone_number_verified: {
        type: Boolean,
        default: false,
        trim: true
    },
    role: {
        type: String,
        default: "user",
        trim: true
    },
});

export const UserModel = mongoose.model<User>("User", UserSchema);