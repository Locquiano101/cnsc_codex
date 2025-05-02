import { Posts } from "../models/users.js";
// Create a new posts
export const CreateNewPosts = async (req, res) => {
  console.log("body:", req.body);
  console.log("body:", req.file);

  try {
    const { title, content, organization, tags } = req.body;

    // Parse tags safely
    const parsedTags =
      typeof tags === "string"
        ? JSON.parse(tags)
        : Array.isArray(tags)
        ? tags
        : [];

    // Handle uploaded files
    const photoDocumentations =
      req.files?.photo?.map((file) => file.filename) || [];
    const resolutionDocuments =
      req.files?.document?.map((file) => file.filename) || [];

    const newPost = new Posts({
      title,
      caption: content || "",
      organization,
      tags: parsedTags,
      status: "published",
      content: {
        photos: photoDocumentations,
        documents: resolutionDocuments,
      },
    });

    const savedPost = await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: savedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid tags format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createPosts = async (req, res) => {
  try {
    const { organization, caption, title } = req.body;
    let { tags } = req.body;

    console.log(req.body);
    // Check if tags is a string and convert it to array if needed
    if (tags && typeof tags === "string") {
      tags = tags.split(",").map((tag) => tag.trim());
    }

    const newPosts = new Posts({
      organization,
      title,
      caption,
      tags,
      status: "Pending",
    });

    const savedPosts = await newPosts.save();
    res.status(201).json(savedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating posts", error });
  }
};
// Get all postss
export const getAllPostss = async (req, res) => {
  try {
    const postss = await Posts.find().populate("organization");
    res.status(200).json(postss);
  } catch (error) {
    res.status(500).json({ message: "Error fetching postss", error });
  }
};

// Get a single posts by ID
export const getPostsById = async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.id).populate("organization");
    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Update a posts
export const updatePosts = async (req, res) => {
  try {
    const updatedPosts = await Posts.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedPosts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    res.status(200).json(updatedPosts);
  } catch (error) {
    res.status(500).json({ message: "Error updating posts", error });
  }
};

// Delete a posts
export const deletePosts = async (req, res) => {
  try {
    const deletedPosts = await Posts.findByIdAndDelete(req.params.id);
    if (!deletedPosts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    res.status(200).json({ message: "Posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting posts", error });
  }
};
