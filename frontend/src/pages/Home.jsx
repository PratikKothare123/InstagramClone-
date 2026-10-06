import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import API from '../services/api';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (deletedId) => {
    setPosts(posts.filter((p) => p._id !== deletedId));
  };

  return (
    <div>
      {user && <CreatePost onPostCreated={handlePostCreated} />}

      <h3 style={styles.heading}>Feed</h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>Loading feed...</div>
      ) : error ? (
        <div style={{ color: '#ed4956', textAlign: 'center' }}>{error}</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#8e8e8e', padding: '30px' }}>
          No posts yet. Be the first to share a photo!
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
          />
        ))
      )}
    </div>
  );
};

const styles = {
  heading: {
    marginBottom: '16px',
    color: '#262626',
  },
};

export default Home;
