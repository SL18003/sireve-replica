import { Text, TextInput, TextArea, Button, Card, Icon } from '@gravity-ui/uikit';
import { Envelope, Smartphone, Geo } from '@gravity-ui/icons';

export default function Contacto() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
        <Icon data={Envelope} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">Contacto</Text>
        <Text variant="header-1" className="page-hero-sub">Estamos para servirte. Déjanos tu mensaje.</Text>
      </div>
      <div className="page-body">
        <div className="contacto-grid">
          <Card view="raised" className="contacto-form">
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Nombre Completo</Text>
              <TextInput size="l" placeholder="Ingresa tu nombre" />
            </div>
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Correo Electrónico</Text>
              <TextInput size="l" type="email" placeholder="tucorreo@ejemplo.com" />
            </div>
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Asunto</Text>
              <TextInput size="l" placeholder="¿De qué trata tu consulta?" />
            </div>
            <div className="contacto-field">
              <Text variant="body-2" className="contacto-label">Mensaje</Text>
              <TextArea size="l" minRows={5} placeholder="Escribe tu mensaje aquí..." />
            </div>
            <Button size="l" view="action" className="contacto-btn">Enviar Mensaje</Button>
          </Card>

          <Card view="raised" className="contacto-info">
            <div className="contacto-info-item">
              <Icon data={Geo} size={20} className="contacto-info-icon" />
              <div><Text variant="body-2" className="contacto-info-label">Dirección</Text><Text variant="body-2" color="secondary">San Salvador, El Salvador</Text></div>
            </div>
            <div className="contacto-info-item">
              <Icon data={Envelope} size={20} className="contacto-info-icon" />
              <div><Text variant="body-2" className="contacto-info-label">Correo</Text><Text variant="body-2" color="secondary">info@sireve.csuca.org</Text></div>
            </div>
            <div className="contacto-info-item">
              <Icon data={Smartphone} size={20} className="contacto-info-icon" />
              <div><Text variant="body-2" className="contacto-info-label">Teléfono</Text><Text variant="body-2" color="secondary">+503 2222-2222</Text></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
