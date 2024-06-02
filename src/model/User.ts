import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: { 
        type: String, 
        required: [true, "Username is required"] ,
        trim: true,
        unique: true,
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match:[/.+\@.+\..+/, "please use a valid  email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required:[true,"verify is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required:[true,"verify code expire is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,

    }  ,
    isAcceptingMessages: {
        type:Boolean,
        default: true,
    },
    messages:[MessageSchema],
});


const UserModel = (mongoose.models.Users as mongoose.Model<User>)||(mongoose.model<User>("Users", UserSchema));
export default UserModel;
