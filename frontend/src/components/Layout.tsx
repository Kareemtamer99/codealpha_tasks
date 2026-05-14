import React from 'react';
import Navbar from './Navbar';
import styles from './Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={`${styles.main} container`}>{children}</main>
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} EventRS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
