import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        const url = `mongodb+srv://darsh2510:darsh%402510@project.wt9x4.mongodb.net/?retryWrites=true&w=majority&appName=Project
`;
        const connection = await mongoose.connect(url);
        console.log(connection);
    }catch(error){
        console.log(`An Error Occured `+error);
        process.exit(1);
    }
}