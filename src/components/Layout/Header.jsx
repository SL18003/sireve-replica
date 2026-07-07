import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@gravity-ui/uikit';
import { Bars, Xmark } from '@gravity-ui/icons';
import './Header.css';

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'SIREVE', path: '/sireve' },
  { label: 'FICCUA', path: '/ficcua' },
  { label: 'JUDUCA', path: '/juduca' },
  { label: 'Excelencia', path: '/excelencia-academica' },
  { label: 'Promotoras', path: '/promotoras-salud' },
  { label: 'Voluntariado', path: '/voluntariado' },
  { label: 'Actas', path: '/actas' },
  { label: 'Galería', path: '/galeria/2019' },
  { label: 'Reglamentos', path: '/reglamentos' },
  { label: 'Contacto', path: '/contacto' },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="header-logo-text">SIREVE</span>
        </Link>

        <button className="header-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <Icon data={menuOpen ? Xmark : Bars} size={24} />
        </button>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`header-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
