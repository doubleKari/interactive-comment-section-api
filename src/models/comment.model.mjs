import mongoose from "mongoose";
import replySchema from "./reply.model.mjs";

const commentSchema = new mongoose.Schema({
    content: {type: String, required:true},
    createdAt: {type: Date, default: Date.now},
    score: {type: Number, default: 0},
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    replies: [{type: replySchema, default:[]}]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


commentSchema.virtual('id').get(function(){
    return this._id.toHexString();
})


commentSchema.set('toJSON', {
    virtuals: true, 
    transform: (doc, ret)=>{
        delete ret._id;
        delete ret.__v;
        return ret;
    }
})

const Comment = mongoose.model("Comment", commentSchema);


export default Comment;