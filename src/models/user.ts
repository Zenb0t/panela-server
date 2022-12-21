import mongoose from 'mongoose';

interface User {
    id: string;
    username: string;
    email: string;
    passHash: string;
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
    passHash: {
        type: String,
        trim: true,
        required: true,
        select: false,
    },
    id: {
        type: String,
        default: mongoose.Types.ObjectId.toString(),
        trim: true
    },
    role: {
        type: String,
        default: "user",
        trim: true
    }
});

export const UserModel = mongoose.model<User>("User", UserSchema);