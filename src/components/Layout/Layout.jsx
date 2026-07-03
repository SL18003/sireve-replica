import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

export default function Layout({ currentTheme, onToggleTheme }) {
  return (
    <div className="layout-container">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
      <main className="main-content">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
