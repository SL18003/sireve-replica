import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Card, Skeleton } from '@gravity-ui/uikit';
import { Picture } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Galeria.css';

const events2017 = [
  { id: '1', title: 'Sesión Comite Directivo CONREVE, Panamá 30 y 31 de mayo 2017' },
  { id: '2', title: 'CEUCA. Costa Rica, 2017' },
  { id: '3', title: 'Unidad de Comunicación CSUCA' },
  { id: '4', title: 'CONADER' },
  { id: '5', title: 'Primera Visita Organización Ruben Dario. El Salvador' },
  { id: '6', title: '1ER. Congresillo JUDUCA 2018. Panamá' },
  { id: '7', title: 'Organización Congreso Neurociencias' },
];

export default function Galeria() {
  const { year } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [year]);

  const items = year === '2017' ? events2017 : [];

  return (
    <div className="page-wrap">
      <PageHeader
        title={`Galería ${year}`}
        subtitle="Eventos y actividades del SIREVE"
        icon={Picture}
      />
      <div className="page-body">
        <div className="galeria-grid">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} view="raised" className="galeria-card">
                <Skeleton style={{ width: '100%', height: 220, borderRadius: 0 }} />
                <div className="galeria-card-body">
                  <Skeleton style={{ height: 18, width: '90%', borderRadius: 4 }} />
                </div>
              </Card>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <Card key={item.id} view="raised" className="galeria-card">
                <div className="galeria-img-wrap">
                  <img
                    src={`https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop&sig=${item.id}`}
                    alt={item.title}
                  />
                </div>
                <div className="galeria-card-body">
                  <Text variant="body-2" className="galeria-card-title">{item.title}</Text>
                </div>
              </Card>
            ))
          ) : (
            <div className="galeria-empty">
              <Text variant="body-2" color="secondary">
                No hay eventos registrados para el año {year}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
