import app from "./app.mjs";
import 'dotenv/config'
import { connectDB } from "./src/config/db.mjs";



const PORT = process.env.PORT || 3000;

const startServer = async ()=> {
    try {
        await connectDB();
        app.listen(PORT, ()=> {
            console.log(`App is listening on port ${PORT}`);
            console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
            
        })
    } catch (error) {
        console.log(`Error: ${error}`);
        
    }
};



startServer();






