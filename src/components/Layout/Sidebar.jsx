import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Icon, Text } from '@gravity-ui/uikit';
import {
  House, Folder, Picture, ChevronDown, ChevronUp,
  Bars, Envelope, Sun, Moon, Xmark,
  ShieldCheck, StarFill, HeartPulse, Person,
} from '@gravity-ui/icons';
import './Sidebar.css';

const programLinks = [
  { label: 'SIREVE', hash: 'sireve', icon: ShieldCheck },
  { label: 'FICCUA', hash: 'ficcua', icon: StarFill },
  { label: 'JUDUCA', hash: 'juduca', icon: StarFill },
  { label: 'Premio Rubén Darío', hash: 'premio-ruben-dario', icon: StarFill },
  { label: 'Promotoras de Salud', hash: 'promotoras-salud', icon: HeartPulse },
  { label: 'Voluntariado', hash: 'voluntariado', icon: Person },
];

export default function Sidebar({ currentTheme, onToggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [galeriaOpen, setGaleriaOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isGaleriaActive = location.pathname.startsWith('/galeria');

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location.pathname, location.hash]);

  const handleProgramClick = (hash) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${hash}`);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navClass = (active) => `nav-link${active ? ' nav-link--active' : ''}`;

  return (
    <>
      <Button
        view="raised"
        size="l"
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Icon data={Bars} size={20} />
      </Button>

      <div
        className={`sidebar-overlay${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar${isCollapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <Link to="/" className="sidebar-logo">SIREVE</Link>
          )}
          <div className="sidebar-header-actions">
            <Button
              view="flat"
              size="l"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="sidebar-toggle-btn desktop-only"
              aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              <Icon data={Bars} size={18} />
            </Button>
            <Button
              view="flat"
              size="l"
              onClick={() => setMobileOpen(false)}
              className="sidebar-close-btn mobile-only"
              aria-label="Cerrar menú"
            >
              <Icon data={Xmark} size={18} />
            </Button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item">
            <Link to="/" className={navClass(isActive('/'))} title="Inicio">
              <Icon data={House} size={18} />
              {!isCollapsed && <Text variant="body-2">Inicio</Text>}
            </Link>
          </div>

          <div className="nav-group">
            <button
              type="button"
              className={`nav-link nav-group-toggle${programsOpen ? ' nav-link--active' : ''}`}
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setProgramsOpen(!programsOpen);
              }}
              title="Programas"
            >
              <div className="nav-link-left">
                <Icon data={ShieldCheck} size={18} />
                {!isCollapsed && <Text variant="body-2">Programas</Text>}
              </div>
              {!isCollapsed && <Icon data={programsOpen ? ChevronUp : ChevronDown} size={16} />}
            </button>
            {programsOpen && !isCollapsed && (
              <div className="nav-subgroup">
                {programLinks.map((p) => (
                  <button
                    key={p.hash}
                    type="button"
                    className="nav-sublink nav-sublink-btn"
                    onClick={() => handleProgramClick(p.hash)}
                  >
                    <Icon data={p.icon} size={14} />
                    <Text variant="body-1">{p.label}</Text>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="nav-item">
            <Link to="/reglamentos" className={navClass(isActive('/reglamentos'))} title="Reglamentos">
              <Icon data={Folder} size={18} />
              {!isCollapsed && <Text variant="body-2">Reglamentos</Text>}
            </Link>
          </div>

          <div className="nav-item">
            <Link to="/actas" className={navClass(isActive('/actas'))} title="Actas">
              <Icon data={Folder} size={18} />
              {!isCollapsed && <Text variant="body-2">Actas</Text>}
            </Link>
          </div>

          <div className="nav-group">
            <button
              type="button"
              className={`nav-link nav-group-toggle${isGaleriaActive ? ' nav-link--active' : ''}`}
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setGaleriaOpen(!galeriaOpen);
              }}
              title="Galería"
            >
              <div className="nav-link-left">
                <Icon data={Picture} size={18} />
                {!isCollapsed && <Text variant="body-2">Galería</Text>}
              </div>
              {!isCollapsed && <Icon data={galeriaOpen ? ChevronUp : ChevronDown} size={16} />}
            </button>
            {galeriaOpen && !isCollapsed && (
              <div className="nav-subgroup">
                {['2017', '2018', '2019'].map((year) => (
                  <Link
                    key={year}
                    to={`/galeria/${year}`}
                    className={`nav-sublink${location.pathname === `/galeria/${year}` ? ' nav-sublink--active' : ''}`}
                  >
                    <Text variant="body-1">{year}</Text>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="nav-item">
            <Link to="/contacto" className={navClass(isActive('/contacto'))} title="Contacto">
              <Icon data={Envelope} size={18} />
              {!isCollapsed && <Text variant="body-2">Contacto</Text>}
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <Button
            view="flat"
            size="l"
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={currentTheme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          >
            <Icon data={currentTheme === 'light' ? Moon : Sun} size={18} />
            {!isCollapsed && (
              <Text variant="body-2">
                {currentTheme === 'light' ? 'Modo oscuro' : 'Modo claro'}
              </Text>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
