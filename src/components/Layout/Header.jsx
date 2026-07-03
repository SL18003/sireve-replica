import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Icon } from '@gravity-ui/uikit';
import { ChevronDown, ChevronUp, Bars, Xmark, Sun, Moon } from '@gravity-ui/icons';
import './Header.css';

const programLinks = [
  { label: '¿Qué es SIREVE?', hash: 'sireve' },
  { label: 'Qué es FICCUA', hash: 'ficcua' },
  { label: 'Qué es JUDUCA', hash: 'juduca' },
  { label: 'Premio Rubén Darío', hash: 'premio-ruben-dario' },
  { label: 'Promotoras de Salud', hash: 'promotoras-salud' },
  { label: 'Voluntariado', hash: 'voluntariado' },
];

const galeriaYears = ['2017', '2018', '2019'];

export default function Header({ currentTheme, onToggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [galeriaOpen, setGaleriaOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setProgramsOpen(false);
    setGaleriaOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
    }
  }, [location.pathname, location.hash]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleProgramClick = (hash) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${hash}`);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <span className="header-logo">SIREVE</span>
          <span className="header-tagline">CSUCA</span>
        </Link>

        <button
          type="button"
          className="header-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          <Icon data={mobileOpen ? Xmark : Bars} size={22} />
        </button>

        <nav className={`header-nav${mobileOpen ? ' open' : ''}`}>
          <Link to="/" className={`header-link${isActive('/') && location.pathname === '/' ? ' active' : ''}`}>
            Inicio
          </Link>

          <div className="header-dropdown">
            <button
              type="button"
              className={`header-link header-dropdown-toggle${programsOpen ? ' open' : ''}`}
              onClick={() => { setProgramsOpen(!programsOpen); setGaleriaOpen(false); }}
            >
              Programas
              <Icon data={programsOpen ? ChevronUp : ChevronDown} size={14} />
            </button>
            {programsOpen && (
              <div className="header-dropdown-menu">
                {programLinks.map((p) => (
                  <button key={p.hash} type="button" className="header-dropdown-item" onClick={() => handleProgramClick(p.hash)}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/actas" className={`header-link${isActive('/actas') ? ' active' : ''}`}>
            Actas
          </Link>

          <div className="header-dropdown">
            <button
              type="button"
              className={`header-link header-dropdown-toggle${isActive('/galeria') || galeriaOpen ? ' active' : ''}`}
              onClick={() => { setGaleriaOpen(!galeriaOpen); setProgramsOpen(false); }}
            >
              Galería
              <Icon data={galeriaOpen ? ChevronUp : ChevronDown} size={14} />
            </button>
            {galeriaOpen && (
              <div className="header-dropdown-menu">
                <Link to="/galeria" className="header-dropdown-item" onClick={() => setMobileOpen(false)}>
                  Todas las galerías
                </Link>
                {galeriaYears.map((year) => (
                  <Link key={year} to={`/galeria/${year}`} className="header-dropdown-item" onClick={() => setMobileOpen(false)}>
                    {year}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/reglamentos" className={`header-link${isActive('/reglamentos') ? ' active' : ''}`}>
            Reglamentos
          </Link>

          <Link to="/contacto" className={`header-link header-link--cta${isActive('/contacto') ? ' active' : ''}`}>
            Contacto
          </Link>

          <Button view="flat" size="m" onClick={onToggleTheme} className="header-theme-btn" title="Cambiar tema">
            <Icon data={currentTheme === 'light' ? Moon : Sun} size={18} />
          </Button>
        </nav>
      </div>
    </header>
  );
}
