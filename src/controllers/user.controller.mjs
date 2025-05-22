import User from "../models/user.model.mjs";



const addUser = async (req, res)=> {
    const {username} = req.body;

    const newUser = new User(
        {username: username}
    )

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(error){
        res.status(500).json({message: "Error creating user", error: error.message});   
    }
}



const getUsers = async (req, res)=>{
    try {
        const users = await User.find();

        if (!users){
            return res.status(404).json({message: "No comments found."})
        }
        return res.status(200).json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


const userController = {
    addUser, 
    getUsers
}

export default userController