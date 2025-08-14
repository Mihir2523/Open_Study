export const asyncHandler = (fun) =>{
    return async(req,res,next) => {
        Promise.resolve(fun(req,res,next)).catch((error) => next(error));
    }
}
