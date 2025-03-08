import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = memo(() => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.navbarContainer}>
        <div className={styles.navbarBrand}>
          <Link to="/" aria-label="Attendance System Home">
            <img src="/logo192.png" alt="" className={styles.navbarLogo} />
            <span className={styles.navbarTitle}>Attendance System</span>
          </Link>
        </div>

        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`} />
        </button>

        <div className={`${styles.navbarMenu} ${mobileMenuOpen ? styles.active : ''}`}>
          <Link to="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/records" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Records
                </Link>
              )}
              <div className={styles.userDropdown}>
                <div className={styles.userDropdownToggle} tabIndex={0}>
                  <span className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</span>
                  <span className={styles.userName}>{user.name}</span>
                </div>
                <div className={styles.userDropdownMenu}>
                  <div className={styles.userInfo}>
                    <p className={styles.userRole}>{user.role}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                  <hr />
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className={styles.loginLink} onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
});

export default Navbar;