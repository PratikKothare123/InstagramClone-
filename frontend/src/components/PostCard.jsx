import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const postOwnerId = typeof post.user === 'object' ? post.user?._id : post.user;
  const postUsername = typeof post.user === 'object' ? post.user?.username : 'user';
  const isOwner = user && user._id === postOwnerId;

  const isLiked = user && post.likes?.some((id) => id === user._id || id?._id === user._id);

  const handleLikeToggle = async () => {
    if (!user) return alert('Please login to like posts!');
    setLoading(true);
    try {
      let res;
      if (isLiked) {
        res = await API.delete(`/posts/${post._id}/like`);
      } else {
        res = await API.post(`/posts/${post._id}/like`);
      }
      if (onPostUpdated) {
        onPostUpdated(res.data);
      }
    } catch (err) {
      console.error('Like toggle error:', err);
      alert(err.response?.data?.message || 'Error updating like');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setLoading(true);
    try {
      await API.delete(`/posts/${post._id}`);
      if (onPostDeleted) {
        onPostDeleted(post._id);
      }
    } catch (err) {
      console.error('Delete post error:', err);
      alert(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <Link to={`/profile/${postUsername}`} style={styles.username}>
          @{postUsername}
        </Link>
        {isOwner && (
          <button onClick={handleDelete} disabled={loading} style={styles.deleteBtn}>
            Delete
          </button>
        )}
      </div>

      <img src={post.imageUrl} alt={post.caption || 'Post'} style={styles.image} />

      <div style={styles.content}>
        <div style={styles.actions}>
          <button
            onClick={handleLikeToggle}
            disabled={loading}
            style={{
              ...styles.likeBtn,
              backgroundColor: isLiked ? '#ed4956' : '#0095f6',
            }}
          >
            {isLiked ? '❤️ Unlike' : '🤍 Like'}
          </button>
          <span style={styles.likeCount}>
            {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
          </span>
        </div>

        {post.caption && (
          <p style={styles.caption}>
            <strong>@{postUsername}</strong> {post.caption}
          </p>
        )}
        <small style={styles.time}>{new Date(post.createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #dbdbdb',
    borderRadius: '8px',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #efefef',
  },
  username: {
    fontWeight: 'bold',
    color: '#262626',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    color: '#ed4956',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    display: 'block',
  },
  content: {
    padding: '12px 16px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  likeBtn: {
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  likeCount: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  caption: {
    marginTop: '6px',
    fontSize: '0.95rem',
    lineHeight: '1.4',
  },
  time: {
    display: 'block',
    marginTop: '8px',
    color: '#8e8e8e',
    fontSize: '0.75rem',
  },
};

export default PostCard;
