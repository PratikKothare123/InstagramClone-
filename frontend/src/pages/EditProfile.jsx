import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const EditProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.put('/users/profile', { username, bio });
      updateUser(res.data);
      navigate(`/profile/${res.data.username}`);
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Edit Profile</h2>
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell something about yourself..."
            rows="4"
            style={styles.textarea}
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={loading} style={styles.saveBtn}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/${user?.username}`)}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #dbdbdb',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '500px',
    margin: '30px auto',
  },
  title: {
    marginBottom: '20px',
    fontSize: '1.4rem',
    color: '#262626',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
    color: '#262626',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #dbdbdb',
    fontSize: '0.95rem',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #dbdbdb',
    fontSize: '0.95rem',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  saveBtn: {
    backgroundColor: '#0095f6',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#fafafa',
    color: '#262626',
    border: '1px solid #dbdbdb',
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  error: {
    color: '#ed4956',
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
};

export default EditProfile;
