import express from 'express';
import mongoose from 'mongoose';
import blocked from '../models/blockroom.js';

const router = express.Router();

export const createBlock=async(req,res)=>{
    const reque=req.body;
    
    const newreq=new blocked({...reque,createdAt: new Date().toISOString()})
    try {
        await newreq.save()
        res.status(201).json(newreq);
    } catch (error) {
        
    }
}
export const deleteBlock = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const deletedReq = await blocked.findByIdAndRemove(id);
  
      if (!deletedReq) {
        return res.status(404).json({ message: "Element not found" });
      }
  
      res.status(200).json({ message: "Element deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const getBlocks=async(req,res)=>{
    try {
        const allrequests=await blocked.find().sort({ _id: -1 })
        res.json(allrequests)
    } catch (error) {
        res.send(err);
    }

}