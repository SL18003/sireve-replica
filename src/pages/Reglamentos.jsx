import { Text, List, Button } from '@gravity-ui/uikit';

const reglamentos = [
  { id: '1', title: 'RELAMENTO GENERAL SIREVE' }
];

export default function Reglamentos() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Text variant="display-2" as="h1" style={{ marginBottom: '24px' }}>Reglamentos</Text>
      
      <List
        items={reglamentos}
        renderItem={(item) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--g-color-line-generic)' }}>
            <Text variant="body-2">{item.title}</Text>
            <Button view="action">
              CONSULTAR
            </Button>
          </div>
        )}
      />
    </div>
  );
}
