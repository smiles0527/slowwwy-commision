import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logo}>S L O W W W Y</span>
          <span className={styles.badge}>Admin</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Gallery
          </NavLink>
          <NavLink
            to="/admin/content"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Content
          </NavLink>
          <NavLink
            to="/admin/commissions"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Commissions
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.email}>{user?.email}</span>
          <button className={styles.signOut} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
