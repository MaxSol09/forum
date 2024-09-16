import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    subscribes: {
        type: Array,
        default: []
    },
    countSubs: {
        type: Number,
        default: 0
    },
    avatarUrl: String,
    backgroundProfile: String
    },
    {
        timestamps: true
    }
)


export default mongoose.model('User', userSchema)