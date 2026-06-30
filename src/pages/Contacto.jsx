import { Text, TextInput, TextArea, Button, Card } from '@gravity-ui/uikit';

export default function Contacto() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Text variant="display-2" as="h1" style={{ marginBottom: '16px' }}>Contacto</Text>
      <Text variant="body-2" color="secondary" style={{ marginBottom: '32px', display: 'block' }}>
        ¿Tienes alguna duda o consulta? Déjanos tu mensaje y te responderemos a la brevedad.
      </Text>

      <Card view="raised" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <Text variant="body-2" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nombre Completo</Text>
          <TextInput size="l" placeholder="Ingresa tu nombre" />
        </div>

        <div>
          <Text variant="body-2" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Correo Electrónico</Text>
          <TextInput size="l" type="email" placeholder="tucorreo@ejemplo.com" />
        </div>

        <div>
          <Text variant="body-2" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Asunto</Text>
          <TextInput size="l" placeholder="¿De qué trata tu consulta?" />
        </div>

        <div>
          <Text variant="body-2" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mensaje</Text>
          <TextArea size="l" minRows={5} placeholder="Escribe tu mensaje aquí..." />
        </div>

        <Button size="l" view="action" style={{ marginTop: '8px', alignSelf: 'flex-start' }}>
          Enviar Mensaje
        </Button>
      </Card>
    </div>
  );
}
