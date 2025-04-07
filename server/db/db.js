import  mongoose from "mongoose";


function connectDB(){
mongoose.connect(process.env.MONGOOSE_URI,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{console.log('Connected to DB')}).catch(err=>console.log(err));
    };


   export default connectDB;