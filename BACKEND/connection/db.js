const mongoose=require('mongoose')
const dbConnection=()=>{
  mongoose.connect(process.env.MONGO_URI)
  console.log("connected to database")
}
module.exports=dbConnection;