const {createHmac,randomBytes}=require("crypto");
const {Schema,model}=require('mongoose');
const { createTokenForUser } = require("../services/authentication");

const userSchema=new Schema({
    fullName:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    salt:{
        type:String,
       
    },
    password:{
        type:String,
        require:true,
    },
    profileImageURL:{
      type:String,
      default:"/images/profile.png",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
    
},{timestamps:true});

//save data in mongodb through singup.
userSchema.pre("save",function(next){
    const user=this;

    if(!user.isModified("password"))return;

    const salt=randomBytes(16).toString();//to generate random  string  length 10.
    const hashedPassword=createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt=salt;
    this.password=hashedPassword;

    next();
});

//for signin 
userSchema.static(
    "matchPasswordAndGenerateToken", 
    async function(email,password){
    const user= await this.findOne({email});
    if(!user)  throw new Error('User not found');

    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256",salt)
    .update(password)
    .digest("hex");

    if(hashedPassword!=userProvidedHash) throw new Error('Incorrect password ');

 //   return {...user._doc,password:undefined,salt:undefined};//return the user if user exist.
   const token=createTokenForUser(user);//after adding authentication function
   return token;
});
 

 
const User=model("user",userSchema);

module.exports=User;