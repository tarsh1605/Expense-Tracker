const User=require('../models/user')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const generateAccessToken=(user)=>{
  return jwt.sign({id:user._id,},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20m'})
}
const generateRefreshToken=(user)=>{
  return jwt.sign({id:user._id,},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})

}
const userSignIn=async(req,res)=>{
    const{username,password,email}=req.body;
    if(!username){
      return res.status(400).json({message:'Username field is empty'});
    }
    if(!password){
      return res.status(400).json({message:'password field is empty'});
    }
    if(!email){
      return res.status(400).json({message:'email field is empty'});
    }
    try{
      const user=await User.findOne({$or:[{email},{username}]});
      if(user){
        return res.status(400).json({message:"User already exists"})
      }
      const newUser=new User({username,email,password});
   
      await newUser.save();
      return res.status(200).json({user:newUser,success:true});
    }catch(err){
      console.log(err);
     return  res.status(500).json({ error: 'Unable to sign in user' });
    }
}
const userLogin=async(req,res)=>{
  const{email,password}=req.body;
  if(!password){
    return res.status(400).json({message:'password field is empty'});
  }
  if(!email){
    return res.status(400).json({message:'email field is empty'});
  }
  try{
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"User does not exists"});
    }
    const check=await bcrypt.compare(password,user.password);
    if(!check){
      return res.status(400).json({message:"Wrong Password",success:false})
    }
    const accessToken=generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const  userWithToken= await User.findByIdAndUpdate(user._id,{refreshToken}).select("-password")
    const options = {
      httpOnly: true,
      secure: true
  }
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json({user:userWithToken,messsage:"user login successfully",success:true,accessToken,refreshToken})
  }
  catch(err){
    res.status(500).json({error:err.message})
  }
}

const userLogout=async(req,res)=>{
  await User.findByIdAndUpdate(req.body.id,{
      $unset:{
          refreshToken:1
      }
  },
  {
      new:true
  }
  )
  const options = {
      httpOnly: true,
      secure: true
  }
  return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({message:"user logout successfully",success:true})
}
const tokenRefresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Refresh token is invalid or expired" });
      }
      const accessToken = generateAccessToken(user);
      // console.log("New access token issued:", accessToken);
      return res.json({ accessToken });
    });
  } catch (err) {
    console.error("Error during token refresh:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports={userSignIn,userLogin,userLogout,tokenRefresh}