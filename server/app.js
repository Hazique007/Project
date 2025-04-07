import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoute.js";
import itemRoutes from "./routes/itemRoutes.js"




dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send('API is running');
});



mongoose.connect(process.env.MONGOOSE_URI).then((result)=>{
    console.log("Connection Successfull")
    app.listen(PORT,(err)=>{
        if(err) console.log(err);
        console.log("running succesful at",PORT);
        
        
        
        
    });
    
}).catch((err)=>{
    console.log("error:",err);
    
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

