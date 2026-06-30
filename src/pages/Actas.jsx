import { useState, useEffect } from 'react';
import { Text, Card, Button, Skeleton } from '@gravity-ui/uikit';

const actasCategories = [
  'CONSEJO DIRECTIVO CONREVE',
  'FICCUA',
  'JUDUCA',
  'PROMOTORAS DE LA SALUD',
  'SESIONES CONREVE'
];

export default function Actas() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Text variant="display-2" as="h1" style={{ marginBottom: '24px' }}>Actas</Text>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%', marginTop: '20px' }}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} view="raised" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: '140px', width: '100%' }}>
              <Skeleton style={{ height: '24px', width: '80%', borderRadius: '4px' }} />
              <div style={{ flexGrow: 1 }} />
              <Skeleton style={{ height: '36px', width: '100%', borderRadius: '4px' }} />
            </Card>
          ))
        ) : (
          actasCategories.map((category, index) => (
            <Card key={index} view="raised" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <Text variant="header-1" as="h3">{category}</Text>
              <div style={{ flexGrow: 1 }} />
              <Button view="action" width="max">CONSULTAR</Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
