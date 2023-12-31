import express from 'express';
import mongoose from 'mongoose';
import request from '../models/request.js';

const router = express.Router();

export const getRequests=async(req,res)=>{
    try {
        const allrequests=await request.find().sort({ _id: -1 })
        res.json(allrequests)
    } catch (error) {
        res.send(err);
    }

}

export const getRequest=async(req,res)=>{
    const {id}=req.params;
    try {
        const request_1=await request.findById(id);
        res.status(200).json(request_1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

export const attended=async(req,res)=>{
    const {id}=req.params;
    try {
        const updatedRequest=await request.findOneAndUpdate(
            {_id:id},
            {attended:true}
        )
        res.json(updatedRequest);

    } catch (error) {
        
    }
}

export const acceptRequest_1=async(req,res)=>{
    const {id}=req.params;
    try {
        const updatedRequest=await request.findOneAndUpdate(
            {_id:id},
            {requestStatus_1:'Approved'}
        )
        res.json(updatedRequest);

    } catch (error) {
        
    }
}
export const rejectRequest_1=async(req,res)=>{
    const {id}=req.params;
    const com = req.body;
    const id1 = Object.keys(com)[0];
    try {
        const updatedRequest=await request.findOneAndUpdate(
            {_id:id},
            { $set: { requestStatus_2: 'Declined', rejectComment: id1 } },
            { new: true }
        )
        res.json(updatedRequest);

    } catch (error) {
        
    }
}



export const acceptRequest_2=async(req,res)=>{
    const {id}=req.params;

    try {
        const updatedRequest=await request.findOneAndUpdate(
            {_id:id},
            {requestStatus_2:'Approved'}
        )
        res.json(updatedRequest);

    } catch (error) {
        
    }
}
export const rejectRequest_2=async(req,res)=>{
    const {id}=req.params;
    const com = req.body;
    const id1 = Object.keys(com)[0];
    try {
        const updatedRequest=await request.findOneAndUpdate(
            {_id:id},
            { $set: { requestStatus_2: 'Declined', rejectComment: id1 } },
            { new: true }
        )
        res.json(updatedRequest);

    } catch (error) {
        
    }
}
export const acceptRequest_3=async(req,res)=>{
    const {id}=req.params;
    try {
        const updatedRequest=await request.findOneAndUpdate(
            {_id:id},
            {requestStatus_3:'Approved'}
        )
        res.json(updatedRequest);

    } catch (error) {
        
    }
}
export const rejectRequest_3 = async (req, res) => {
    const { id } = req.params;
    const com = req.body;
    const id1 = Object.keys(com)[0];

    try {
        const updatedRequest = await request.findOneAndUpdate(
            { _id: id },
            { $set: { requestStatus_3: 'Declined', rejectComment: id1 } },
            { new: true }
        );

        res.json(updatedRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const WithdrawRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRequest = await request.findOneAndUpdate(
            { _id: id },
            {
                requestStatus_1: 'Withdrawed',
                requestStatus_2: 'Withdrawed',
                requestStatus_3: 'Withdrawed',
            }
        );

        if (!updatedRequest) {
            // Handle the case where the document with the given _id is not found
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json(updatedRequest);
    } catch (error) {
        // Handle other errors, e.g., database errors
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
   
    }
}

export const createRequest=async(req,res)=>{
    const reque=req.body;
    //console.log(reque)
    // const startTime = new Date(`2000-01-01T${reque?.starttime}:00`);
    // const endTime = new Date(`2000-01-01T${reque?.endtime}:00`);

    // if (startTime > endTime) {
    //     return res.status(400).json({ error: "Invalid time: starttime cannot be greater than endtime." });
    // }
    const newreq=new request({...reque,requestedBy:req.userId,createdAt: new Date().toISOString()})
    try {
        await newreq.save()
        res.status(201).json(newreq);
    } catch (error) {
        
    }
}