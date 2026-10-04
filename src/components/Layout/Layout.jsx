import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
