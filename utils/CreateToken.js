const jwt=require("jsonwebtoken");

const createToken=(payload)=>{
   return jwt.sign({userId:payload},process.env.SECRET_KEY_JWT,{
    expiresIn:process.env.EXPIRES_JWT
   })
}

module.exports=createToken;