const Post = require('../models/Post');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username name');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Upload image buffer to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const post = await Post.create({
      user: req.user._id,
      imageUrl,
      caption: caption || '',
    });

    const populatedPost = await Post.findById(post._id).populate('user', 'username name');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: error.message || 'Failed to create post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check post ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this post' });
    }

    await post.deleteOne();

    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).populate('user', 'username name');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).populate('user', 'username name');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePost,
  likePost,
  unlikePost,
};
