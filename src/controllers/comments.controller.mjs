import { CommmentsModel } from "../models/comments.model.mjs";
import mongoose from "mongoose";



export const getComments = async (req, res)=>{
    try{
        const commentsData = await CommmentsModel.findOne();
        if (!commentsData){
            return res.status(404).json({"message":"No comments found"})
        }
        res.status(200).json(commentsData)
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}


