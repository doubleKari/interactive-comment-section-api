import {Comment, User} from "../models/index.mjs"


//fetch all comments
const getComments = async (req, res) => {
    try {
      const commentsData = await Comment.find()
      .populate('userId')
      .populate('replies.userId');
      
      if (!commentsData) {
        return res.status(404).json({ message: "No comments found" });
      }
      res.status(200).json(commentsData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};




//create a comment
const addComment = async (req, res) => {
    const { content, userId} = req.body;

    if (!content || !userId){
      return res.status(400).json({message: "Content and userId are required to create a comment."})
    }


    try {
      const existingUser = await User.findById(userId);
      if (!existingUser){
        return res.status(400).json({message: "User not found  with the provided user id."})
      }
      
      const newCommentData =  new Comment({
        content: content,
        userId: userId 
      });

      const createdComment = await newCommentData.save();

      const populatedComment = await Comment.findById(createdComment._id)
      .populate('userId')     
      .populate('replies.userId')
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
}


//fetch a comment

const getComment = async (req, res)=> {
  const commentId = req.params.id;

  if (!commentId){
    return res.status(400).json({message: `Comment with id ${commentId} cannot be found.`});
  }
  
  try {
    const response = await Comment.findById(commentId)
    .populate('userId')
    .populate('replies.userId');


    res.status(200).json(response);
  }catch(error){
    res.status(500).json({message: error.message})
  }
  


}


const commentsController = {
    getComments,
    addComment, 
    getComment
}

export default commentsController;