import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Instagram Clone</h2>
      <h4 style={styles.subtitle}>Login to view photos</h4>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <div style={styles.footer}>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #dbdbdb',
    borderRadius: '8px',
    padding: '30px 20px',
    maxWidth: '380px',
    margin: '40px auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#8e8e8e',
    marginBottom: '20px',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #dbdbdb',
    fontSize: '0.9rem',
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#0095f6',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    marginTop: '6px',
  },
  error: {
    color: '#ed4956',
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '0.9rem',
    color: '#262626',
  },
};

export default Login;
