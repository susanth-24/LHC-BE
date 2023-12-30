import mongoose from "mongoose";

const blockroom = mongoose.Schema({
    rrule:String,
    title:String,
    roomName:String,
    room:String,
    start: String, 
    end: String, 
    isRecurring:Boolean,
    status:Boolean,
    reason:String,
    bgColor:String,
    createdAt: {
        type: Date,
        default: new Date()
    },
});

const blocked = mongoose.model('blockedRoom', blockroom);

export default blocked;