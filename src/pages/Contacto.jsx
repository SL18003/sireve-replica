import { useState } from 'react';
import { Text, TextInput, TextArea, Button, Card, Icon } from '@gravity-ui/uikit';
import { Envelope, Geo, Smartphone } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Contacto.css';

export default function Contacto() {
  /* Envio simulado: la validacion nativa del <form> (required + type=email)
     bloquea campos vacios y correos invalidos; el submit solo se dispara con
     datos validos, y ahi se muestra el mensaje y se limpia el formulario. */
  const [enviado, setEnviado] = useState(false);

  const handleSend = (event) => {
    event.preventDefault();
    setEnviado(true);
    event.currentTarget.reset();
  };

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
            <div
              className={enviado ? 'contacto-form-success show' : 'contacto-form-success'}
              role="status"
            >
              <p className="contacto-form-success-text">
                ¡Gracias por contactarnos! Nos pondremos en contacto con usted en breve.
              </p>
            </div>
            {/* action="https://formspree.io/f/XXXX" method="POST" — activar cuando se configure Formspree */}
            <form onSubmit={handleSend}>
              <div className="contacto-field">
                <Text variant="body-2" className="contacto-label">Nombre Completo</Text>
                <TextInput size="l" placeholder="Ingresa tu nombre" name="nombre" controlProps={{ required: true }} />
              </div>
              <div className="contacto-field">
                <Text variant="body-2" className="contacto-label">Correo Electrónico</Text>
                <TextInput size="l" type="email" placeholder="tucorreo@ejemplo.com" name="email" controlProps={{ required: true }} />
              </div>
              <div className="contacto-field">
                <Text variant="body-2" className="contacto-label">Asunto</Text>
                <TextInput size="l" placeholder="¿De qué trata tu consulta?" name="asunto" controlProps={{ required: true }} />
              </div>
              <div className="contacto-field">
                <Text variant="body-2" className="contacto-label">Mensaje</Text>
                <TextArea size="l" minRows={5} placeholder="Escribe tu mensaje aquí..." name="mensaje" controlProps={{ required: true }} />
              </div>
              <Button
                type="submit"
                size="l"
                view="action"
                className="contacto-btn"
              >
                Enviar Mensaje
              </Button>
            </form>
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
