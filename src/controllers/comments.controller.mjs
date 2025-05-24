import mongoose, { mongo } from "mongoose";
import {Comment, User} from "../models/index.mjs"


//fetch all comments
const getComments = async (req, res) => {
    try {
      const commentsData = await Comment.find()
      .populate('user')
      .populate('replies.user');
      
      if (!commentsData) {
        return res.status(404).json({ message: "No comments found" });
      }
      res.status(200).json(commentsData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};



//fetch a comment

const getComment = async (req, res)=> {
  const commentId = req.params.id;

  if (!commentId){
    return res.status(400).json({message: `Comment with id ${commentId} cannot be found.`});
  }
  
  try {
    const response = await Comment.findById(commentId)
    .populate('user')
    .populate('replies.user');


    res.status(200).json(response);
  }catch(error){
    res.status(500).json({message: error.message})
  }
  


}



//create a comment
const addComment = async (req, res) => {
    const { content, user} = req.body;

    if (!content || !user){
      return res.status(400).json({message: "Content and user are required to create a comment."})
    }


    try {
      const existingUser = await User.findById(user);
      if (!existingUser){
        return res.status(400).json({message: "User not found  with the provided user id."})
      }
      
      const newCommentData =  new Comment({
        content: content,
        user: user
      });

      const createdComment = await newCommentData.save();

      const populatedComment = await Comment.findById(createdComment._id)
      .populate('user')     
      .populate('replies.user')
      res.status(201).json(populatedComment);
      
  }catch(error){
    if (error.name === 'ValidationError') {
      // Construct a more detailed error message from validation errors
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: "Validation failed", errors });
    }
  // General server error
    console.error("Error in addComment:", error); // Log the actual error for debugging
    res.status(500).json({ message: error.message });

  }
};



//delete a comment 
const deleteComment = async(req, res) => {
  /*
    1. Find comment id
    2. Delete
  */
  const commentId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(commentId)){
    return res.status(400).json({ message: `Invalid comment ID format: ${commentId}` });
  }



  try{
      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return res.status(404).json({ message: `Comment with ID ${commentId} not found.` });
      }

      res.status(204).send();
      
  }catch(error){
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Internal server error while deleting comment.', error: error.message });
  }
};







//update a comment

const updateComment = async (req, res)=>{
  const commentId = req.params.id;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)){
    return res.status(400).json({ message: `Invalid comment ID format: ${commentId}` });
  }
  
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updates,
      {
        new: true,
        runValidators: true,

      }
    )
    .populate('user')
    .populate('replies.user')

    if (!updateComment){
      return res.status(404).json({ message: `Comment with ID ${commentId} not found.` });
    }

    res.status(200).json(updatedComment);
  }catch(error){
    console.error('Error updating comment:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error during update.', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error while updating comment.', error: error.message });

  }
}



const commentsController = {
    getComments,
    getComment,
    addComment,
    deleteComment,
    updateComment,

}

export default commentsController;



