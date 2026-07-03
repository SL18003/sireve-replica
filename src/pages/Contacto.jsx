import { Text, TextInput, TextArea, Button, Card, Icon } from '@gravity-ui/uikit';
import { Envelope, Geo, Smartphone } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Contacto.css';

export default function Contacto() {
  return (
    <div className="page-wrap">
      <PageHeader
        title="Contacto"
        subtitle="¿Tienes alguna duda o consulta? Déjanos tu mensaje."
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
            <Button size="l" view="action" className="contacto-btn">Enviar Mensaje</Button>
          </Card>

          <Card view="raised" className="contacto-info">
            <Text variant="header-1" className="contacto-info-heading">Información</Text>
            <div className="contacto-info-item">
              <Icon data={Geo} size={20} className="contacto-info-icon" />
              <div>
                <Text variant="body-2" className="contacto-info-label">Dirección</Text>
                <Text variant="body-2" color="secondary">San Salvador, El Salvador</Text>
              </div>
            </div>
            <div className="contacto-info-item">
              <Icon data={Envelope} size={20} className="contacto-info-icon" />
              <div>
                <Text variant="body-2" className="contacto-info-label">Correo</Text>
                <Text variant="body-2" color="secondary">info@sireve.csuca.org</Text>
              </div>
            </div>
            <div className="contacto-info-item">
              <Icon data={Smartphone} size={20} className="contacto-info-icon" />
              <div>
                <Text variant="body-2" className="contacto-info-label">Teléfono</Text>
                <Text variant="body-2" color="secondary">+503 2222-2222</Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
