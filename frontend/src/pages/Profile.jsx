import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import API from '../services/api';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/users/${username}`);
      setProfileData(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</div>;
  }

  if (error || !profileData) {
    return <div style={{ textAlign: 'center', color: '#ed4956', padding: '50px' }}>{error || 'User not found'}</div>;
  }

  const { user: profileUser, posts } = profileData;
  const isOwnProfile = currentUser && currentUser._id === profileUser._id;

  const isFollowing = currentUser && profileUser.followers?.some((id) => id === currentUser._id || id?._id === currentUser._id);

  const handleFollowToggle = async () => {
    if (!currentUser) return alert('Please login to follow users');
    setFollowLoading(true);

    try {
      if (isFollowing) {
        await API.delete(`/users/${profileUser._id}/follow`);
        setProfileData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            followers: prev.user.followers.filter(
              (id) => id !== currentUser._id && id?._id !== currentUser._id
            ),
          },
        }));
      } else {
        await API.post(`/users/${profileUser._id}/follow`);
        setProfileData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            followers: [...prev.user.followers, currentUser._id],
          },
        }));
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
      alert(err.response?.data?.message || 'Error updating follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setProfileData((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)),
    }));
  };

  const handlePostDeleted = (deletedId) => {
    setProfileData((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p._id !== deletedId),
    }));
  };

  return (
    <div>
      <div style={styles.headerCard}>
        <div style={styles.info}>
          <h2 style={styles.name}>{profileUser.name}</h2>
          <h4 style={styles.username}>@{profileUser.username}</h4>
          <p style={styles.bio}>{profileUser.bio || 'No bio yet.'}</p>

          <div style={styles.stats}>
            <div>
              <strong>{posts.length}</strong> posts
            </div>
            <div>
              <strong>{profileUser.followers?.length || 0}</strong> followers
            </div>
            <div>
              <strong>{profileUser.following?.length || 0}</strong> following
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            {isOwnProfile ? (
              <Link to="/edit-profile" style={styles.editBtn}>
                Edit Profile
              </Link>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                style={{
                  ...styles.followBtn,
                  backgroundColor: isFollowing ? '#efefef' : '#0095f6',
                  color: isFollowing ? '#262626' : '#fff',
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      <h3 style={styles.postsTitle}>Posts</h3>
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#8e8e8e', padding: '30px' }}>
          No posts shared yet.
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
  headerCard: {
    backgroundColor: '#fff',
    border: '1px solid #dbdbdb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  name: {
    fontSize: '1.4rem',
    color: '#262626',
  },
  username: {
    color: '#8e8e8e',
    fontWeight: '500',
  },
  bio: {
    margin: '8px 0',
    color: '#262626',
    fontSize: '0.95rem',
  },
  stats: {
    display: 'flex',
    gap: '24px',
    marginTop: '12px',
    fontSize: '0.95rem',
  },
  editBtn: {
    display: 'inline-block',
    backgroundColor: '#fafafa',
    border: '1px solid #dbdbdb',
    padding: '6px 16px',
    borderRadius: '4px',
    fontWeight: 'bold',
    color: '#262626',
    textDecoration: 'none',
  },
  followBtn: {
    border: '1px solid #dbdbdb',
    padding: '6px 20px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  postsTitle: {
    marginBottom: '16px',
    color: '#262626',
  },
};

export default Profile;
