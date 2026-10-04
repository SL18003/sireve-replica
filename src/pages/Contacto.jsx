import { Text, TextInput, TextArea, Button, Card, Icon } from '@gravity-ui/uikit';
import { Envelope, Geo, Smartphone } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Contacto.css';

export default function Contacto() {
  return (
    <div className="page-wrap">
      <PageHeader
        title="Contacto"
        subtitle="El SIREVE es un sistema del CSUCA; las consultas se dirigen a la Secretaría General."
        icon={Envelope}
      />
      <div className="page-body">
        <div className="contacto-grid">
          <Card view="raised" className="contacto-form">
            {/* action="https://formspree.io/f/XXXX" method="POST" — activar cuando se configure Formspree */}
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Nombre Completo</Text>
              <TextInput size="l" placeholder="Ingresa tu nombre" name="nombre" />
            </div>
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Correo Electrónico</Text>
              <TextInput size="l" type="email" placeholder="tucorreo@ejemplo.com" name="email" />
            </div>
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Asunto</Text>
              <TextInput size="l" placeholder="¿De qué trata tu consulta?" name="asunto" />
            </div>
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Mensaje</Text>
              <TextArea size="l" minRows={5} placeholder="Escribe tu mensaje aquí..." name="mensaje" />
            </div>
            <Button
              size="l"
              view="action"
              className="contacto-btn"
              onClick={() => window.alert('Mensaje enviado (demostración). Configure Formspree para envío real.')}
            >
              Enviar Mensaje
            </Button>
          </Card>

          <Card view="raised" className="contacto-info">
            <Text variant="header-1" className="contacto-info-heading">Información</Text>
            <div className="contacto-info-item">
              <Icon data={Geo} size={20} className="contacto-info-icon" />
              <div>
                <Text variant="body-2" className="contacto-info-label">Dirección</Text>
                <Text variant="body-2" color="secondary">
                  Av. Las Américas 1-03, Zona 14,<br />
                  interior Club Deportivo Los Arcos,<br />
                  Ciudad de Guatemala, Guatemala
                </Text>
              </div>
            </div>
            <div className="contacto-info-item">
              <Icon data={Envelope} size={20} className="contacto-info-icon" />
              <div>
                <Text variant="body-2" className="contacto-info-label">Correo</Text>
                <a href="mailto:sg@csuca.org" className="contacto-info-link">sg@csuca.org</a>
              </div>
            </div>
            <div className="contacto-info-item">
              <Icon data={Smartphone} size={20} className="contacto-info-icon" />
              <div>
                <Text variant="body-2" className="contacto-info-label">Teléfono</Text>
                <a href="tel:+50225027500" className="contacto-info-link">+(502) 2502-7500</a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
