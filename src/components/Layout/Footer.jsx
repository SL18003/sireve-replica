import { Text, Icon } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import { Globe, Envelope, Geo } from '@gravity-ui/icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1440,30 L1440,60 L0,60 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Text variant="header-1" className="footer-brand-title">SIREVE</Text>
            <Text variant="body-2" className="footer-brand-desc">
              Sistema Regional de Vida Estudiantil del Consejo Superior Universitario Centroamericano.
            </Text>
            <a href="http://www.csuca.org/" target="_blank" rel="noopener noreferrer" className="footer-csuca">
              <Icon data={Globe} size={16} />
              CSUCA
            </a>
          </div>

          <div className="footer-col">
            <Text variant="header-1" className="footer-col-title">Programas</Text>
            <div className="footer-links">
              <Link to="/sireve">SIREVE</Link>
              <Link to="/ficcua">FICCUA</Link>
              <Link to="/juduca">JUDUCA</Link>
              <Link to="/excelencia-academica">Premio Rubén Darío</Link>
              <Link to="/promotoras-salud">Promotoras de Salud</Link>
              <Link to="/voluntariado">Voluntariado</Link>
            </div>
          </div>

          <div className="footer-col">
            <Text variant="header-1" className="footer-col-title">Recursos</Text>
            <div className="footer-links">
              <Link to="/actas">Actas</Link>
              <Link to="/galeria/2019">Galería</Link>
              <Link to="/reglamentos">Reglamentos</Link>
              <Link to="/contacto">Contacto</Link>
            </div>
          </div>

          <div className="footer-col">
            <Text variant="header-1" className="footer-col-title">Contacto</Text>
            <div className="footer-contact-item">
              <Icon data={Geo} size={16} />
              <Text variant="body-2">San Salvador, El Salvador</Text>
            </div>
            <div className="footer-contact-item">
              <Icon data={Envelope} size={16} />
              <Text variant="body-2">info@sireve.csuca.org</Text>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <Text variant="body-1">Built with HTML5 and CSS3</Text>
          <Text variant="body-1">&copy; {new Date().getFullYear()} CSUCA</Text>
        </div>
      </div>
    </footer>
  );
}
