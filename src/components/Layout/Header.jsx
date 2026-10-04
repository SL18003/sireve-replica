import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@gravity-ui/uikit';
import { ChevronDown, ChevronUp, Bars, Xmark, ArrowUpRightFromSquare } from '@gravity-ui/icons';
import SocialLinks from './SocialLinks';
import './Header.css';

const programLinks = [
  { label: 'Qué es FICCUA', to: '/programas/ficcua' },
  { label: 'Qué es JUDUCA', to: '/programas/juduca' },
  { label: 'Excelencia Académica', to: '/programas/premio-ruben-dario' },
  { label: 'Promotoras de Salud', to: '/programas/promotoras-salud' },
  { label: 'Voluntariado', to: '/programas/voluntariado' },
];

const galeriaYears = ['2017', '2018', '2019'];

export default function Header() {
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
          <span className="header-brand-logo">
            <img src="/images/logo-csuca.png" alt="CSUCA" className="header-logo-img" />
          </span>
          <span className="header-brand-text">
            <span className="header-brand-title">
              Consejo Superior Universitario
              <br />
              Centroamericano
            </span>
          </span>
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

          <button
            type="button"
            className="header-link header-nav-anchor"
            onClick={() => handleProgramClick('sireve')}
          >
            SIREVE
          </button>

          <div className="header-divider" aria-hidden="true" />

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
                  <Link
                    key={p.to}
                    to={p.to}
                    className="header-dropdown-item"
                    onClick={() => { setProgramsOpen(false); setMobileOpen(false); }}
                  >
                    {p.label}
                  </Link>
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

          <a
            href="https://csuca.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link header-link--external"
            title="Sitio oficial del CSUCA"
          >
            CSUCA
            <Icon data={ArrowUpRightFromSquare} size={11} />
          </a>

          <SocialLinks variant="header" className="header-social" />
        </nav>
      </div>
    </header>
  );
}
