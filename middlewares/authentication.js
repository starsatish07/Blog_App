const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        
        if(!tokenCookieValue){
           res.locals.user=null;
          return next();
        }
       try{
        const userPayload=validateToken(tokenCookieValue);
        req.user=userPayload;
        res.locals.user = userPayload;  // ✅ Pass user to templates
       }catch(error){
        console.error("JWT Validation Error:", error);
        res.locals.user = null;
        }
       next();
    };
}

module.exports={
    checkForAuthenticationCookie,
};