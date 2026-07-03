import { Link } from 'react-router-dom';
import { Text } from '@gravity-ui/uikit';
import { Picture } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import { handleImageError } from '../utils/imageFallback';
import './Galeria.css';

const years = [
  { year: '2017', image: '/images/gallery/1.jpg' },
  { year: '2018', image: '/images/gallery/2.jpg' },
  { year: '2019', image: '/images/gallery/3.jpg' },
];

export default function GaleriaIndex() {
  return (
    <div className="page-wrap">
      <PageHeader
        title="Galería"
        subtitle="Eventos y actividades del SIREVE por año"
        icon={Picture}
      />
      <div className="page-body">
        <div className="galeria-years-grid">
          {years.map(({ year, image }) => (
            <Link key={year} to={`/galeria/${year}`} className="galeria-year-card">
              <div className="galeria-year-image">
                <img src={image} alt={`Galería ${year}`} onError={handleImageError} />
              </div>
              <div className="galeria-year-body">
                <h3 className="galeria-year-title">{year}</h3>
                <span className="btn-ver">Consultar</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
