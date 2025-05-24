import mongoose from "mongoose";


export const replySchema = new mongoose.Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    score: {type: Number, default: 0},
    replyingTo: {type: String, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    }

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


replySchema.virtual('id').get(function(){
    return this._id.toHexString();
})


replySchema.set('toJSON', {
    virtuals: true, 
    transform: (doc, ret)=>{
        delete ret._id;
        delete ret.__v;
        return ret;
    }
})


export default replySchema;



