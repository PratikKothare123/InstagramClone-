const User = require('../models/User');
const Post = require('../models/Post');


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username name');

    res.json({
      user,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, bio } = req.body;

    if (username && username.toLowerCase() !== user.username) {
      const usernameExists = await User.findOne({ username: username.toLowerCase() });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username.toLowerCase();
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      bio: updatedUser.bio,
      followers: updatedUser.followers,
      following: updatedUser.following,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    // Add targetUser to current user's following
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });

    // Add currentUser to target user's followers
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Remove targetUser from current user's following
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });

    // Remove currentUser from target user's followers
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
};
