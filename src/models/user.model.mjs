import mongoose from "mongoose";    

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true}
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});





userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret)=>{
        delete ret._id;
        delete ret.__v;


        return ret;
    }
})

const User = mongoose.model('User', userSchema);

export default User;