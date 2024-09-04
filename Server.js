const express=require("express")
const app=express();
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const morgan=require("morgan")
const helmet=require("helmet");
const authRouter=require('./routes/auth')
const forgotPasswordRoutes = require('./routes/ForgotPassword');
dotenv.config();

//add middleware
app.use(express.json());
app.use(morgan("commom"));
app.use(helmet());

//mongo db connection.
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>
{
    console.log("Mongo Db is coneccted Successfully")
}).catch(error=>{
    console.log(error)
});

app.use("/api/auth",authRouter)
// Use forgot password routes
app.use('/api/forgot-password', forgotPasswordRoutes);


app.listen(3000,()=>{
    console.log("Node js is started")
}
)