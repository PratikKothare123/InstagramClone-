import React, { useState } from 'react';
import API from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);

      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFile(null);
      setCaption('');
      // Reset file input
      e.target.reset();

      if (onPostCreated) {
        onPostCreated(res.data);
      }
    } catch (err) {
      console.error('Upload post error:', err);
      setError(err.response?.data?.message || 'Failed to upload post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Create New Post</h3>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Select Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={styles.fileInput}
          />
        </div>
        <div style={styles.field}>
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="3"
            style={styles.textarea}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Uploading to Cloudinary...' : 'Share Post'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid #dbdbdb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  title: {
    marginBottom: '12px',
    fontSize: '1.1rem',
    color: '#262626',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#8e8e8e',
  },
  fileInput: {
    fontSize: '0.9rem',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #dbdbdb',
    fontSize: '0.95rem',
    resize: 'vertical',
  },
  submitBtn: {
    backgroundColor: '#0095f6',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  error: {
    color: '#ed4956',
    fontSize: '0.85rem',
    marginBottom: '8px',
  },
};

export default CreatePost;
