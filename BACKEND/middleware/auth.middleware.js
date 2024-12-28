const jwt=require('jsonwebtoken');

const authMiddleWare=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  // console.log(authHeader)
  if(!authHeader||!authHeader.startsWith('Bearer ')){
    return res.status(401).json({message:'Unauthorized'})
  }
  const token=authHeader.split(' ')[1];

  // const token = req.cookies.accessToken
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err){
      return res.status(403).json({message:'Forbidden'});
    }
    req.user=user;
    next();
  })
}

module.exports=authMiddleWare;