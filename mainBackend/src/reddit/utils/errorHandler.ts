export const errorHandler = async (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Error Occured";
    res
    .status(err.statusCode)
    .json({
        status:false,
        message:err.message
    });
}