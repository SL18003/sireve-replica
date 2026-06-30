import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Text } from '@gravity-ui/uikit';
import { House, Folder, Picture, ChevronDown, ChevronUp, Bars, Envelope } from '@gravity-ui/icons';
import './Sidebar.css'; 

export default function Sidebar() {
  const [actasOpen, setActasOpen] = useState(false);
  const [galeriaOpen, setGaleriaOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <Text variant="display-1" as="h1" className="sidebar-title">SIREVE</Text>}
        <Button 
          view="flat" 
          size="l" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-toggle-btn"
        >
          <Icon data={Bars} size={20} />
        </Button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item">
          <Link to="/" className="nav-link" title="Inicio">
            <Icon data={House} size={18} />
            {!isCollapsed && <Text variant="body-2">Inicio</Text>}
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/reglamentos" className="nav-link" title="Reglamentos">
            <Icon data={Folder} size={18} />
            {!isCollapsed && <Text variant="body-2">Reglamentos</Text>}
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/actas" className="nav-link" title="Actas">
            <Icon data={Folder} size={18} />
            {!isCollapsed && <Text variant="body-2">Actas</Text>}
          </Link>
        </div>

        <div className="nav-group">
          <button 
            className="nav-link nav-group-toggle"
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
              <Link to="/galeria/2017" className="nav-sublink">
                <Text variant="body-1">2017</Text>
              </Link>
              <Link to="/galeria/2018" className="nav-sublink">
                <Text variant="body-1">2018</Text>
              </Link>
              <Link to="/galeria/2019" className="nav-sublink">
                <Text variant="body-1">2019</Text>
              </Link>
            </div>
          )}
        </div>

        <div className="nav-item">
          <Link to="/contacto" className="nav-link" title="Contacto">
            <Icon data={Envelope} size={18} />
            {!isCollapsed && <Text variant="body-2">Contacto</Text>}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
