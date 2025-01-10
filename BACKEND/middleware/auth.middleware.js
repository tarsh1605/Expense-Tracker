const jwt=require('jsonwebtoken');

const authMiddleWare=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(!authHeader||!authHeader.startsWith('Bearer ')){
    return res.status(403).json({message:'Unauthorized'})
  }
  const token=authHeader.split(' ')[1];
  try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({ message: "Forbidden" });
        }
        req.user=user;
        next();
      });
    } catch (err) {
      console.error("Error during token verification:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

}

module.exports=authMiddleWare;