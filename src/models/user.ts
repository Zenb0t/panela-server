import mongoose from 'mongoose';

export interface User {
    id: string;
    username: string;
    email: string;
    email_verified: boolean;
    phone_number?: string;
    phone_number_verified?: boolean;
    role: string;
}

const UserSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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
        unique: true,
    },
    phone_number_verified: {
        type: Boolean,
        default: false,
        trim: true
    },
    id: {
        type: String,
        default: mongoose.Types.ObjectId.toString(),
        trim: true,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        trim: true
    },
});

export const UserModel = mongoose.model<User>("User", UserSchema);