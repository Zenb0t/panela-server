import mongoose from 'mongoose';

interface User {
    uuid: string;
    username: string;
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema<User>({
    uuid: {
        type: String,
        required: true,
        trim: true,
    },
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
    password: {
        type: String,
        trim: true,
        required: true,
        select: false,
    }
});

const UserModel = mongoose.model<User>("User", UserSchema);
module.exports = UserModel;