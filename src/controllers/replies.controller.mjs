import {Comment, User} from "../models/index.mjs"
import mongoose from "mongoose"


//create a reply to a particular comment
const addReply = async (req, res) =>{
    const commentId = req.params.id

    const {content, replyingTo, user} = req.body;

    // validate all incoming data
    if (!content || !replyingTo || !user){
        return res.status(400).json({ message: 'Content, replyingTo, and user are required for a reply.' });
    }

    // validate all IDs

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: `Invalid comment ID format: ${commentId}` });
    }
    if (!mongoose.Types.ObjectId.isValid(replyingTo)) {
        return res.status(400).json({ message: `Invalid replyingToUserId format: ${replyingTo}` });
    }
    if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ message: `Invalid userId format: ${user}` });
    }





    try {

        //verify the user making the reply exists

        const existingUser = await User.findById(user);
        if (!existingUser){
            return res.status(400).json({message: "User not found with the provided user."})
        }


        //find parent comment by it's ID
        const parentComment = await Comment.findById(commentId);
        if (!parentComment){
            return res.status(404).json({message: "Parent comment not found."});
        }

        
        //Look up the username of the user being replied to
        const repliedToUser = await User.findById(replyingTo);
        if (!repliedToUser){
            return res.status(404).json({message: "User being replied to not found."})

        }

        //create new reply object
        const newReply = {
            content: content,
            score: 0,
            replyingTo: repliedToUser.username,
            user: user
        }

        //add new reply to the parent comment's reply array
        parentComment.replies.push(newReply);


        //save the updated parent comment document
        const savedDocument = await parentComment.save();

        //Respond with the updated comment, populated with user details for both comments and replies
        const populatedComment = await Comment.findById(savedDocument._id)
        .populate('user')   //populate the main comment's user
        .populate('replies.user'); //populate the user for each reply

        res.status(201).json(populatedComment);

    }catch(error){
        console.error("Error adding reply", error);
        res.status(500).json({message: "Error adding reply", error: error.message})

    }
}



//get replies to a particular comment

const getRepliesForComment = async (req, res)=>{
    const commentId = req.params.id;

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
