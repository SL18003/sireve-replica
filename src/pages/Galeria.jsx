import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Card, Skeleton } from '@gravity-ui/uikit';

const events2017 = [
  { id: '1', title: 'Sesión Comite Directivo CONREVE, Panamá 30 y 31 de mayo 2017' },
  { id: '2', title: 'CEUCA. Costa Rica, 2017' },
  { id: '3', title: 'Unidad de Comunicación CSUCA' },
  { id: '4', title: 'CONADER' },
  { id: '5', title: 'Primera Visita Organización Ruben Dario. El Salvador' },
  { id: '6', title: '1ER. Congresillo JUDUCA 2018. Panamá' },
  { id: '7', title: 'Organización Congreso Neurociencias' }
];

export default function Galeria() {
  const { year } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [year]);

  let items = [];
  if (year === '2017') {
    items = events2017;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Text variant="display-2" as="h1" style={{ marginBottom: '24px' }}>Galería {year}</Text>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%', marginTop: '20px' }}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} view="raised" style={{ overflow: 'hidden', width: '100%' }}>
              <Skeleton style={{ width: '100%', height: '250px', borderRadius: '0' }} />
              <div style={{ padding: '16px' }}>
                <Skeleton style={{ height: '20px', width: '90%', borderRadius: '4px' }} />
              </div>
            </Card>
          ))
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <Card key={item.id} view="raised" style={{ overflow: 'hidden', width: '100%' }}>
              <img 
                src={`https://picsum.photos/400/300?random=${item.id}`} 
                alt={item.title} 
                style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '16px' }}>
                <Text variant="body-2" style={{ fontWeight: 600 }}>{item.title}</Text>
              </div>
            </Card>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1' }}>
            <Text variant="body-2" color="secondary">No hay eventos registrados para el año {year}</Text>
          </div>
        )}
      </div>
    </div>
  );
}
