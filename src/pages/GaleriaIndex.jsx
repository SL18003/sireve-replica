import { Link } from 'react-router-dom';
import { Text } from '@gravity-ui/uikit';
import { Picture } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Galeria.css';

const years = [
  { year: '2017', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=360&fit=crop' },
  { year: '2018', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=360&fit=crop' },
  { year: '2019', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=360&fit=crop' },
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
                <img src={image} alt={`Galería ${year}`} />
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
