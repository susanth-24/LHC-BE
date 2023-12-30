import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
    RoomName:String,
    RoomId:String,
    sessionName:String,
    UID:String,
    ExpectedMembers:Number,
    category:String,
    name:String,
    email:String,
    entryNumber:String,
    PhNumber:Number,
    requestedBy:String,
    startTime: String, 
    endTime: String, 
    date:String,
    requestStatus_1:{type:String,default:"Pending"},
    requestStatus_2:{type:String,default:"Pending"},
    requestStatus_3:{type:String,default:"Pending"},
    reason:String,
    remarks:String,
    rejectComment:{type:String,default:null},
    createdAt: {
        type: Date,
        default: new Date()
    },
});

const request = mongoose.model('request', requestSchema);

export default request;