import {Comment} from "../models/index.mjs";



//TODO: update score for comment

/*
    Update operation
    {params}: <String> - commentId


*/

const updateScore = async (req, res)=>{
    const commentId = req.params.id;
    const updates = req.body;

    //validate commentId
    if (!mongoose.Types.ObjectId.isValid(commentId)){
        return res.status(404).json({message: `Invalid comment ID format: ${commentId}`})
    }

    try{
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            updates,
            {
                new: true,
                runValidators: true
            }

        ).populate('user').populate('replies.user')

        if (!updatedComment){
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


const scoreController = {
    updateScore,
}

export default scoreController;


