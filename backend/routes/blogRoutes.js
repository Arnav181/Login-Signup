import express from "express";
import Blog from "../models/blog.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/my", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  res.json(blogs);
});

//find blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
});

//myblogs




//update blog
router.put("/:id", authMiddleware, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  if (blog.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  await blog.save();

  res.json(blog);
});


//delete blog
router.delete("/:id", authMiddleware, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  if (blog.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
});

export default router;

