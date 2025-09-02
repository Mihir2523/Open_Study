require('dotenv').config();
import express from "express";
import cors from "cors";
import userRouter from "./Reddit/routes/RedditUserRoutes";
import commRouter from "./Reddit/routes/RedditCommunityRoutes";
import postRouter from "./Reddit/routes/RedditPostsRoutes";
import { connectDB } from "./Reddit/utils/connectDB";
import commentRouter from "./Reddit/routes/RedditCommentRoutes";
import chatRouter from "./Reddit/routes/RedditMessageRoute";
import botRouter from "./Reddit/routes/RedditBotRoutes";
import { Analyze } from "./Reddit/utils/moderatorFilter";
import { getResponse } from "./Reddit/utils/giveResponse";
import { WebSocket,WebSocketServer } from "ws";
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({ 
    origin: ['http://localhost:5173'], 
    credentials: false,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/users',userRouter);
app.use('/posts',postRouter);
app.use('/community',commRouter);
app.use('/comments',commentRouter);
app.use('/chats',chatRouter);
app.use('/bot', botRouter);

app.get('/',async (req,res)=>{
    // const post = {
    //     title:"India People",
    //     description:"They Are Very Intelligent"
    // };
    // const response = await Analyze("They have no civic sense",post,true);
    const text = "Hey What are you and can you help me to make an assay on Queen of Hillstation in india";
    const response = await getResponse(text);
    res.json({
        status:true,
        msg:response
    });
})
async function startServer(){
    await connectDB();
    app.listen(PORT,()=>console.log(`Running On ${PORT}`));
}
startServer();