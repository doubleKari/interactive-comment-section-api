import {Comment, User} from "../models/index.mjs"
import mongoose from "mongoose"


//create a reply to a particular comment
const addReply = async (req, res) =>{
    const {commentId} = req.params.id;

    const {content, replyingTo, user} = req.body;

    if (!content || !replyingTo || !user){
        return res.status(400).json({ message: 'Content, replyingTo, and user are required for a reply.' });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)){
        return res.status(400).json({message: "Invalid comment  ID format"});
    }


    try {
        const existingUser = await User.findById(user);
        if (!existingUser){
            return res.status(400).json({message: "User not found with the provided user."})
        }

        const parentComment = await Comment.findById(commentId);
        if (!parentComment){
            return res.status(404).json({message: "Parent comment not found."});
        }

        const newReply = {
            content: content,
            createdAt: new Date().toISOString(),
            score: 0,
            replyingTo: replyingTo,
            user: user
        }

        parentComment.replies.push(newReply);

        const savedDocument = await parentComment.save();

        const populatedComment = await Comment.findById(savedDocument._id)
        .populate('user')
        .populate('replies.user');

        res.status(201).json(populatedComment);

    }catch(error){
        console.error("Error adding reply", error);
        res.status(500).json({message: "Error adding reply", error: error.message})

    }
}



//get replies to a particular comment

const getRepliesForComment = async (req, res)=>{
    const {commentId} = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: 'Invalid comment ID format.' });
    }

    try {
        const comment = await Comment.findById(commentId)
                                     .populate('replies.user'); // Populate users within replies

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Return only the replies array
        res.status(200).json(comment.replies);
    } catch (error) {
        console.error('Error fetching replies for comment:', error);
        res.status(500).json({ message: 'Error fetching replies', error: error.message });
    }

}











const repliesController = {
    addReply,
    getRepliesForComment
};

export default repliesController;
