import { Text } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import './Footer.css';

const programAnchors = [
  { label: '¿Qué es SIREVE?', hash: 'sireve' },
  { label: 'Qué es FICCUA', hash: 'ficcua' },
  { label: 'Qué es JUDUCA', hash: 'juduca' },
  { label: 'Premio Rubén Darío', hash: 'premio-ruben-dario' },
  { label: 'Promotoras de Salud', hash: 'promotoras-salud' },
  { label: 'Voluntariado', hash: 'voluntariado' },
];

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-col">
          <span className="footer-logo">SIREVE</span>
          <span className="footer-csuca">Consejo Superior Universitario Centroamericano</span>
          <Text variant="body-2" className="footer-text">
            Sistema Regional de Vida Estudiantil — coordinando la vida estudiantil en Centroamérica y el Caribe.
          </Text>
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-col-title">Recursos</Text>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/actas">Actas SIREVE</Link></li>
            <li><Link to="/galeria">Galería</Link></li>
            <li><Link to="/reglamentos">Reglamentos</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-col-title">Programas</Text>
          <ul className="footer-links">
            {programAnchors.map((p) => (
              <li key={p.hash}><Link to={`/#${p.hash}`}>{p.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <Text variant="header-1" className="footer-col-title">Contacto</Text>
          <Text variant="body-2" className="footer-text">
            San Salvador, El Salvador<br />
            info@sireve.csuca.org<br />
            +503 2222-2222
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
