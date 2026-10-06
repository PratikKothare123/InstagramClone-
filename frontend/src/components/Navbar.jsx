import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          Instagram Clone
        </Link>
        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/" style={styles.link}>
                Home
              </Link>
              <Link to={`/profile/${user.username}`} style={styles.link}>
                Profile ({user.username})
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #dbdbdb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '12px 0',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#262626',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    color: '#262626',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #dbdbdb',
    padding: '6px 12px',
    borderRadius: '4px',
    fontWeight: 'bold',
    color: '#ed4956',
  },
};

export default Navbar;
