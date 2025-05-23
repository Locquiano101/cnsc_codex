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
      status: "pending",
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

export const UpdatePosts = async (req, res) => {
  const { title, organization, tags, caption, upload } = req.body;

  try {
    const { postId } = req.params;

    // Find the existing post
    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Get the post ID from the route
    const parsedTags =
      typeof tags === "string"
        ? JSON.parse(tags)
        : Array.isArray(tags)
        ? tags
        : [];

    const uploadedPhotos = [];
    const uploadedDocs = [];

    const allUploads = Array.isArray(upload) ? upload : upload ? [upload] : [];

    allUploads.forEach((file) => {
      const lower = file.toLowerCase();
      if (
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".webp") ||
        lower.endsWith(".gif")
      ) {
        uploadedPhotos.push(file);
      } else {
        uploadedDocs.push(file);
      }
    });

    // Clear and update the content
    post.title = title;
    post.caption = caption;
    post.organization = organization;
    post.tags = parsedTags;
    post.status = "pending";
    post.content = {
      photos: uploadedPhotos,
      documents: uploadedDocs,
    };

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("UpdatePosts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Backend endpoints
export const ApprovedPosts = async (req, res) => {
  try {
    // Get data from request body
    const { postId, status } = req.body;

    console.log("Post status update request received:", req.body);

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Update the post status in the database
    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      { status },
      { new: true } // This returns the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: `Post status updated to ${status} successfully`,
      data: { post: updatedPost },
    });
  } catch (error) {
    console.error("Error in ApprovedPosts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post status",
      error: error.message,
    });
  }
};
export const RevisionPosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status, revision_notes } = req.body;

    // Validate required fields
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    // Update the post with status and revision notes
    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      {
        status: "revision",
        revision_notes,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Post status updated to revision successfully",
      data: { post: updatedPost },
    });
  } catch (error) {
    console.error("Error in RevisionPosts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post status",
      error: error.message,
    });
  }
};
// Get all postss
export const GetAllPosts = async (req, res) => {
  try {
    const postss = await Posts.find().populate("organization");
    res.status(200).json(postss);
  } catch (error) {
    res.status(500).json({ message: "Error fetching postss", error });
  }
};

export const GetAllOrgPosts = async (req, res) => {
  const { orgId } = req.params;

  try {
    const posts = await Posts.find({ organization: orgId }).populate(
      "organization"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
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
