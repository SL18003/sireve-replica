import { Text } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-col">
          <Text variant="header-1" className="footer-title">SIREVE y CSUCA</Text>
          <Text variant="body-2" color="secondary" className="footer-text">
            El Sistema Regional de Vida Estudiantil y el Consejo Superior Universitario Centroamericano trabajan juntos para el desarrollo y la integración de la vida estudiantil en la región.
          </Text>
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-title">Enlaces Rápidos</Text>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/reglamentos">Reglamentos</Link></li>
            <li><Link to="/actas">Actas</Link></li>
            <li><Link to="/galeria/2017">Galería</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-title">Contacto</Text>
          <Text variant="body-2" color="secondary" className="footer-text">
            San Salvador, El Salvador<br />
            info@sireve.centroamerica.edu<br />
            +503 2222-2222
          </Text>
        </div>
      </div>
      <div className="footer-bottom">
        <Text variant="body-1" color="secondary">
          © {new Date().getFullYear()} SIREVE. Todos los derechos reservados.
        </Text>
      </div>
    </footer>
  );
}
