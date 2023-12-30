import mongoose from 'mongoose';

const timeRangeSchema = mongoose.Schema({
  startTime: String, 
  endTime: String,  
});

const availabilitySchema = mongoose.Schema({
  date: Date,
  timeRange: timeRangeSchema, 
  status_1: String,
  status_2: String,
  status_3: String,
  bookedBy: String,
  bookedByName:String,
  UID:String,
});

const roomSchema = mongoose.Schema({
  RoomName: String,
  description: String,
  Capacity: Number,
  name: String,
  creator: String,
  Location: String,
  availability: [availabilitySchema],
  remark: String,
  ban:Boolean,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const roomData = mongoose.model('rooms', roomSchema);

export default roomData;
