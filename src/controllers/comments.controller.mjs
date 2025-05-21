import { CommentModel } from "../models/comments.model.mjs";
import mongoose from "mongoose";



const getComments = async (req, res)=>{
    try{
        const commentsData = await CommentModel.findOne();
        if (!commentsData){
            return res.status(404).json({"message":"No comments found"})
        }
        res.status(200).json(commentsData)
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}


const addComments = async (req, res)=> {
    try{
        const {content, user} = req.body;
        const commentsData = await CommentModel.findOne();

        if (!commentsData){
            commentsData = await CommentModel.create({comments: []});
            return res.status(404).json({"message": "Comments data not found"});
        }

        const newComment = {
           
            content,
            createdAt: Date.now(),
            score: 0, 
            user,
            replies:[]
        };

        commentsData.comment.push(newComment);
        await commentsData.save();

        res.status(201).json(newComment);
    }catch(error){
        res.status(500).json({"message": error.message})

    }
}


export {getComments, addComments}