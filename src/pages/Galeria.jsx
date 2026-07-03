import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Card, Skeleton } from '@gravity-ui/uikit';
import { Picture } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import { handleImageError } from '../utils/imageFallback';
import './Galeria.css';

const galleryByYear = {
  '2017': [
    { id: '1', title: 'Sesión Comite Directivo CONREVE, Panamá 30 y 31 de mayo 2017' },
    { id: '2', title: 'CEUCA. Costa Rica, 2017' },
    { id: '3', title: 'Unidad de Comunicación CSUCA' },
    { id: '4', title: 'CONADER' },
    { id: '5', title: 'Primera Visita Organización Ruben Dario. El Salvador' },
    { id: '6', title: '1ER. Congresillo JUDUCA 2018. Panamá' },
    { id: '7', title: 'Organización Congreso Neurociencias' },
  ],
  '2018': [
    { id: '1', title: 'Sesión Ordinaria CONREVE — Honduras, octubre 2018' },
    { id: '2', title: 'Pre-FICCUA Nicaragua 2018' },
    { id: '3', title: 'Pre-JUDUCA Costa Rica 2018' },
    { id: '4', title: 'Asamblea Promotoras de la Salud 2018' },
    { id: '5', title: 'Encuentro de Voluntariado Universitario CSUCA' },
    { id: '6', title: 'Ceremonia Premio Rubén Darío 2018' },
  ],
  '2019': [
    { id: '1', title: 'Sesión Ordinaria CONREVE — Panamá, mayo 2019' },
    { id: '2', title: 'Pre-FICCUA Guatemala 2019' },
    { id: '3', title: 'Pre-JUDUCA El Salvador 2019' },
    { id: '4', title: 'Jornada de Integración Estudiantil Centroamericana' },
    { id: '5', title: 'Taller de Liderazgo Estudiantil CSUCA' },
    { id: '6', title: 'Actividades de Voluntariado Regional 2019' },
  ],
};

const placeholderImages = [
  '/images/gallery/1.jpg',
  '/images/gallery/2.jpg',
  '/images/gallery/3.jpg',
  '/images/gallery/4.jpg',
  '/images/gallery/5.jpg',
  '/images/gallery/6.jpg',
];

export default function Galeria() {
  const { year } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [year]);

  const items = galleryByYear[year] || [];

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
            items.map((item, index) => (
              <Card key={item.id} view="raised" className="galeria-card">
                <div className="galeria-img-wrap">
                  <img
                    src={placeholderImages[index % placeholderImages.length]}
                    alt={item.title}
                    onError={handleImageError}
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
