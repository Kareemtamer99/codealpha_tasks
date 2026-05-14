import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaUserAlt } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.container} container`}>
        <Link to="/" className={styles.logo}>
          Event<span>RS</span>
        </Link>

        <div className={styles.navLinks}>
          <Link to="/">Events</Link>
          {isAuthenticated && <Link to="/dashboard">My Registrations</Link>}
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
        </div>

        <div className={styles.navActions}>
          <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          {isAuthenticated ? (
            <div className={styles.userSection}>
              <span className={styles.userName}>
                <FaUserAlt /> {user?.name}
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.loginLink}>
                Login
              </Link>
              <Link to="/register" className={styles.registerBtn}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
