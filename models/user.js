import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    //date: Date,
    message:String,
    createdAt: {
        type: Date,
        default: new Date()
    },
  });
  

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    post:{type:String,required:true},
    mobileNumber:Number,
    category:String,
    entryNumber:String,
    notifications:[notificationSchema],
    password: { type: String, required: true },
    id: { type: String },
    icon:String,
    isBan:{type:Boolean,default:false}
})

export default mongoose.model("User", userSchema);