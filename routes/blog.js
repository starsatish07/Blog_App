const {Router}=require('express');
const multer=require("multer");
const path=require("path");
const fs=require("fs");

const Blog=require("../models/blog");
const Comment=require("../models/comment");

const router=Router();

// Define Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve("./public/uploads/"); // Folder to store files

        // Ensure the 'uploads/' folder exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Create if missing
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`; // Unique filename
        cb(null, fileName);
    }
});

// Initialize Multer
const upload = multer({ storage: storage });
  
  

router.get('/add-new',(req,res)=>{
    return res.render("addBlog",{
        user:req.user,// Assuming user info is stored in req.user
    });
});

//
router.get('/:id', async (req,res)=>{
    const blog =await Blog.findById(req.params.id).populate("createdBy");
   // console.log("blog",blog);
  // console.log(blog.createdBy.profileImageURL);
const comments=await Comment.find({ blogId:req.params.id}).populate("createdBy");
console.log("Comments:",comments);
    return res.render('blog',{
        user:req.user,
        blog,//above blog ko reference kar raha hai
        comments,
    });
});


//
router.post('/comment/:blogId', async (req, res) => {
    try {
      const newComment = await Comment.create({
        comment: req.body.content, // Ensure key matches schema
        blogId: req.params.blogId,
        createdBy: req.user._id,
      });
      
      console.log("Comment Created:", newComment);
      
      return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).send("Error creating comment");
    }
  });
  

router.post('/', upload.single("coverImage"), async (req, res) => {
  //  console.log("req.user:", req.user); // Debugging

    if (!req.user) {
        return res.status(401).send("Unauthorized: Please log in.");
    }

    const { title, body } = req.body;

    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });

   // console.log("Created Blog:", blog);
    return res.redirect(`/blog/${blog._id}`);
});



module.exports=router;