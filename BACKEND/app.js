const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors');
const cookieParser = require('cookie-parser');
const dbConnection=require('./connection/db.js')
dotenv.config();
const app=express();
const userRouter=require("./routes/user.routes.js")
const expenseRouter=require('./routes/expense.routes.js')
app.use(express.json())
app.use(cors());
app.use(cookieParser())
const PORT=process.env.PORT||5000;
app.use("/auth",userRouter)
app.use("/expenses",expenseRouter)
const startServer=async()=>{
  try{
    dbConnection();
    app.listen(PORT,()=>{
      console.log(`Server running on PORT ${PORT}`)
    })
  }
  catch(e){
    console.log("Server failed to connect")
  }
}
app.get("/",(req,res)=>{
  res.send("Hello")
})
startServer();