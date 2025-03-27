require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const path = require("path");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();

// Use environment variables
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Set EJS as the template engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// Serve static files from 'public' folder
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
