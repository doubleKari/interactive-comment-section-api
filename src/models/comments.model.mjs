import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},

})



const CurrentUserSchema = new mongoose.Schema(UserSchema.obj)

const ReplySchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    content: {type: String, required: true},
    createdAt: {type:Date, default: Date.now},
    score: {type: Number, default: 0},
    user: {type: UserSchema, required: true}
})


const CommentSchema = new mongoose.Schema({
    id: {type: Number, required:true, unique: true},
    content: {type: String, required: true},
    createdAt: {type:Date, default:Date.now},
    score: {type: Number,  default: 0},
    user: {type: [ReplySchema], default:[]}

})

//main Document Schema
const CommentsDocumentSchema = new mongoose.Schema({
    currentUser: {type: CurrentUserSchema, required:true},
    comment: {type: [CommentSchema], default: []}
})


export const CommmentsModel = new mongoose.model('Comments', CommentsDocumentSchema)







