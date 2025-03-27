const JWT =require("jsonwebtoken");

const secret="$@123";//create the secrete key .

function createTokenForUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
    };
    const token=JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken,
};