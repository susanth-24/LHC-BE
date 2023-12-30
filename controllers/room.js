import express from 'express';
import mongoose from 'mongoose';
import roomData from '../models/room.js';

const router = express.Router();
export const getRooms = async (req, res) => {
    try {
        const rooms = await roomData.find().sort({ _id: -1 })
        res.json({ data: rooms });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createRoom = async (req, res) => {
    const room = req.body;
    const newRoom = new roomData({ ...room, creator: req.userId, createdAt: new Date().toISOString() })
    try {
        await newRoom.save()
        res.status(201).json(newRoom);

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateRoom=async(req,res)=>{
    const {id}=req.params;
    const {RoomName,description,Capacity,Location,remark}=req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Room with id: ${id}`);
    const updatedRoom = { RoomName, description, Capacity,Location,remark , _id: id };
    await roomData.findByIdAndUpdate(id, updatedRoom, { new: true });

    res.json(updatedRoom);
}

export const getRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await roomData.findById(id);
        res.status(200).json(room);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function isRoomAvailable(roomId, date, startTime, endTime) {
    try {
        const room = await roomData.findById(roomId);
        if (!room) {
            throw new Error('Room not Found');
        }
        const checkStart = new Date(date);
        checkStart.setHours(startTime.split(':')[0], startTime.split(':')[1], 0, 0);
        //console.log(checkStart)
        const checkEnd = new Date(date);
        checkEnd.setHours(endTime.split(':')[0], endTime.split(':')[1], 0, 0);
        //console.log(checkEnd)

        const conflictingBookings = room.availability.filter((booking) => {
            const bookingStart = new Date(booking.date);
            bookingStart.setHours(booking?.timeRange?.startTime.split(':')[0], startTime.split(':')[1], 0, 0);
            //console.log(bookingStart)

            const bookingEnd = new Date(booking.date);
            //console.log(bookingEnd)

            return (
                (booking.status_1 === 'Approved'&&booking.status_2 === 'Approved'&&booking.status_3 === 'Approved') &&
                (
                    (checkStart >= bookingStart && checkStart <= bookingEnd) ||
                    (checkEnd >= bookingStart && checkEnd <= bookingEnd) ||
                    (checkStart <= bookingStart && checkEnd >= bookingEnd)
                )
            );
        });

        if (conflictingBookings.length > 0) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking room availability:', error);
        throw error;
    }
}

async function addAvailabilityToRoom(roomId, newAvailability) {
    try {
        const updatedRoom = await roomData.updateOne(
            { _id: roomId },
            { $push: { availability: newAvailability } }

        );

        if (!updatedRoom) {
            throw new Error('Room not found');
        }

        const updatedRoomp = await roomData.findById(roomId);

        return updatedRoomp;
    } catch (error) {
        console.error('Error adding availability to room:', error);
        throw error;
    }
};


export const availableRooms = async (req, res) => {
    try {
        const { date, startTime, endTime } = req.query;
        if (!date || !startTime || !endTime) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        const rooms = await roomData.find().sort({ _id: -1 })
        const availableRooms = []
        for (const room of rooms) {
            const isAvailable = await isRoomAvailable(room.id, date, startTime, endTime)
            if (isAvailable) {
                availableRooms.push(room)
            }
        }
        res.status(200).json(availableRooms)

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateAvailability = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedRoom = await addAvailabilityToRoom(id, data);
        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const acceptReqRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const updateRequest = await roomData.findOneAndUpdate(
            { _id: id },
            { status: 'Approved' },
        );
        res.json(updateRequest);
    } catch (error) {

    }
}

export const acceptAvail_1 = async (req, res) => {
    const { id } = req.params;
    const obj  = req.body;
    const id1 = Object.keys(obj)[0];

    try {
        const room = await roomData.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        //console.log(room?.availability?.[0]?._id);

        const foundAvailability = room?.availability?.find(
            (availability) => availability?.UID === id1
        );

        foundAvailability.status_1 = 'Approved';
        await room.save();
        if (!foundAvailability) {
            return res.status(404).json({ error: 'Availability element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
}
export const acceptAvail_2 = async (req, res) => {
    const { id } = req.params;
    const obj  = req.body;
    const id1 = Object.keys(obj)[0];

    try {
        const room = await roomData.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        //console.log(room?.availability?.[0]?._id);

        const foundAvailability = room?.availability?.find(
            (availability) => availability?.UID === id1
        );

        foundAvailability.status_2 = 'Approved';
        await room.save();
        if (!foundAvailability) {
            return res.status(404).json({ error: 'Availability element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
}
export const acceptAvail_3 = async (req, res) => {
    const { id } = req.params;
    const obj  = req.body;
    const id1 = Object.keys(obj)[0];

    try {
        const room = await roomData.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        //console.log(room?.availability?.[0]?._id);

        const foundAvailability = room?.availability?.find(
            (availability) => availability?.UID === id1
        );

        foundAvailability.status_3 = 'Approved';
        await room.save();
        if (!foundAvailability) {
            return res.status(404).json({ error: 'Availability element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
}

export const rejectAvail_1 = async (req, res) => {
    const { id } = req.params;
    const obj  = req.body;
    const id1 = Object.keys(obj)[0];

    try {
        const room = await roomData.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        //console.log(room?.availability?.[0]?._id);

        const foundAvailability = room?.availability?.find(
            (availability) => availability?.UID === id1
        );

        foundAvailability.status_1 = 'Declined';
        await room.save();
        if (!foundAvailability) {
            return res.status(404).json({ error: 'Availability element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
}
export const rejectAvail_2 = async (req, res) => {
    const { id } = req.params;
    const obj  = req.body;
    const id1 = Object.keys(obj)[0];

   
    try {
        const room = await roomData.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        //console.log(room?.availability?.[0]?._id);

        const foundAvailability = room?.availability?.find(
            (availability) => availability?.UID === id1
        );

        foundAvailability.status_2 = 'Declined';
        await room.save();
        if (!foundAvailability) {
            return res.status(404).json({ error: 'Availability element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
}
export const rejectAvail_3 = async (req, res) => {
    const { id } = req.params;
    const obj  = req.body;
    const id1 = Object.keys(obj)[0];

    
    try {
        const room = await roomData.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        //console.log(room?.availability?.[0]?._id);

        const foundAvailability = room?.availability?.find(
            (availability) => availability?.UID === id1
        );

        foundAvailability.status_3 = 'Declined';
        await room.save();
        if (!foundAvailability) {
            return res.status(404).json({ error: 'Availability element not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
}
export const withdrawAvail = async (req, res) => {
    const { id } = req.params;
    const obj = req.body;
    const id1 = Object.keys(obj)[0];
    console.log(id);
    console.log(obj);
    try {
        const room = await roomData.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const foundAvailability = room?.availability?.find(
            (availability) => availability?.UID === id1
        );

        if (!foundAvailability) {
            return res.status(404).json({ error: 'Availability element not found' });
        }

        foundAvailability.status_1 = 'Withdrawed';
        foundAvailability.status_2 = 'Withdrawed';
        foundAvailability.status_3 = 'Withdrawed';

        room.markModified('availability');

        await room.save();

        res.json({ message: 'Availability updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const banRoom=async(req,res)=>{
    const {id}=req.params;
    try {
        const banned=await roomData.findOneAndUpdate(
            {_id:id},
            {ban:true}
        )
        res.json(banned);

    } catch (error) {
        
    }
}
export const unbanRoom=async(req,res)=>{
    const {id}=req.params;
    try {
        const banned=await roomData.findOneAndUpdate(
            {_id:id},
            {ban:false}
        )
        res.json(banned);

    } catch (error) {
        
    }
}