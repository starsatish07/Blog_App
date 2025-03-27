const {Router}=require('express');
const User=require('../models/user');

const router=Router();

router.get('/signin',(req,res)=>{
    return res.render("signin");
});

router.get('/signup',(req,res)=>{
    return res.render("signup");
});

router.post('/signup', async (req, res) => {
 //   console.log("Request Body:", req.body); // Debugging

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
     //   console.log("Missing Fields!"); // Debugging
        return res.render("signup", { error: "All fields are required." });
    }

    try {
        const newUser = await User.create({
            fullName,
            email,
            password,
        });

     //   console.log("Saved User:", newUser); // Debugging
        return res.redirect("/");
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).render("signup", { error: "Error signing up." });
    }
});


router.post('/signin',async (req,res)=>{
    try{
        const {email,password}=req.body;
 //   console.log(email,password);

    const token= await User.matchPasswordAndGenerateToken(email,password);

 //   console.log("User",token);

 //return res.redirect("/");

    //make a cookies to pass the token
   return res.cookie("token",token).redirect("/");



    }catch(error){
       // console.log("Error hai yha");
        return res.render("signin",{
            error:"Incorrect Email or Password",
        });

    }

});

//setup functionality of logout
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
});




module.exports=router;
