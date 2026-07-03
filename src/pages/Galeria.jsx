import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Skeleton } from '@gravity-ui/uikit';
import { Picture } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import GalleryAlbum from '../components/Gallery/GalleryAlbum';
import { galleryByYear } from '../data/galleryData';
import './Galeria.css';

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
              <div key={index} className="galeria-skeleton">
                <Skeleton style={{ width: '100%', height: 240, borderRadius: 12 }} />
                <Skeleton style={{ height: 18, width: '90%', borderRadius: 4, marginTop: 16 }} />
              </div>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <GalleryAlbum key={item.id} title={item.title} images={item.images} />
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
