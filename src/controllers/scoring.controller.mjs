import mongoose from "mongoose";
import { Comment } from "../models/index.mjs"; 

const updateScore = async (req, res) => {
    const { commentId, replyId } = req.params;

    const { change } = req.body;

    
    if (typeof change !== 'number' || (change !== 1 && change !== -1)) {
        return res.status(400).json({ message: 'Invalid score change value. Must be 1 or -1.' });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: `Invalid comment ID format: ${commentId}` });
    }

    try {
        // 1. Find the main comment document
        let comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: `Comment with ID ${commentId} not found.` });
        }

        let targetScoreObject; // This will point to either the main comment or a reply subdocument

        if (replyId) {
            // This request is to update a reply's score
            if (!mongoose.Types.ObjectId.isValid(replyId)) {
                return res.status(400).json({ message: `Invalid reply ID format: ${replyId}` });
            }

            // Find the specific reply subdocument within the comment
            targetScoreObject = comment.replies.id(replyId); // Mongoose's .id() method for subdocuments
            if (!targetScoreObject) {
                return res.status(404).json({ message: `Reply with ID ${replyId} not found within comment ${commentId}.` });
            }
        } else {
            // This request is to update the main comment's score
            targetScoreObject = comment;
        }

        // 2. Calculate the new score
        let newScore = targetScoreObject.score + change;

        // 3. Prevent score from going below 0
        if (newScore < 0) {
            newScore = 0;
        }

        // 4. Assign the new score
        targetScoreObject.score = newScore;

        // 5. Save the main comment document. Mongoose handles saving subdocument changes automatically.
        const updatedComment = await comment.save();

        // 6. Respond with the updated (and populated) comment
        // We re-populate to ensure the response structure is consistent, as .save() returns the raw document
        const populatedComment = await Comment.findById(updatedComment._id)
            .populate('user')
            .populate('replies.user');

        res.status(200).json(populatedComment);

    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ message: 'Internal server error while updating score.', error: error.message });
    }
};

const scoreController = {
    updateScore,
};

export default scoreController;