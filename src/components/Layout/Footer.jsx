import { Text } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import './Footer.css';

const programLinks = [
  { label: 'Qué es FICCUA', to: '/programas/ficcua' },
  { label: 'Qué es JUDUCA', to: '/programas/juduca' },
  { label: 'Excelencia Académica', to: '/programas/premio-ruben-dario' },
  { label: 'Promotoras de Salud', to: '/programas/promotoras-salud' },
  { label: 'Voluntariado', to: '/programas/voluntariado' },
];

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-brand-row">
            <img src="/images/logo-csuca.png" alt="CSUCA" className="footer-logo-img" />
          </div>
          <span className="footer-csuca">Sistema Regional de Vida Estudiantil</span>
          <Text variant="body-2" className="footer-text">
            Consejo Superior Universitario Centroamericano. Coordinando la vida estudiantil en Centroamérica y el Caribe.
          </Text>
          <SocialLinks variant="footer" className="footer-social" />
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-col-title">Recursos</Text>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/actas">Actas SIREVE</Link></li>
            <li><Link to="/galeria">Galería</Link></li>
            <li><Link to="/reglamentos">Reglamentos</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li>
              <a href="https://csuca.org/" target="_blank" rel="noopener noreferrer">
                Sitio oficial CSUCA
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-col-title">Programas</Text>
          <ul className="footer-links">
            {programLinks.map((p) => (
              <li key={p.to}><Link to={p.to}>{p.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-col-title">Contacto</Text>
          <Text variant="body-2" className="footer-text">
            Secretaría General del CSUCA<br />
            Av. Las Américas 1-03, Zona 14,<br />
            interior Club Deportivo Los Arcos,<br />
            Ciudad de Guatemala, Guatemala<br />
            <a href="mailto:sg@csuca.org" className="footer-link-inline">sg@csuca.org</a><br />
            <a href="tel:+50225027500" className="footer-link-inline">+(502) 2502-7500</a>
          </Text>
        </div>
      </div>
      <div className="footer-bottom">
        <Text variant="body-1" className="footer-copy">
          © {new Date().getFullYear()} SIREVE · CSUCA. Todos los derechos reservados.
        </Text>
      </div>
    </footer>
  );
}
