
const GlobalError=(err,req,res,next)=>{
 err.statusCode=err.statusCode || 500;
 err.statusText=err.statusText || "error";
 res.status(err.statusCode).json({
    statusText:err.statusText,
    error:err,
    message:err.message
 })
}

module.exports=GlobalError;