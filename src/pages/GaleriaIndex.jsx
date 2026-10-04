import { Link } from 'react-router-dom';
import { Text, Icon } from '@gravity-ui/uikit';
import { Calendar, Picture, Person } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import { handleImageError } from '../utils/imageFallback';
import { galleryByYear } from '../data/galleryData';
import { timeline, formatTerm } from '../data/presidents';
import './Galeria.css';

/* Portadas por ano. La lista de anos sale de galleryByYear para que no haya dos
   fuentes de verdad: si se agrega un ano a la galeria aparece solo. */
const covers = {
  2017: '/images/gallery/1.jpg',
  2018: '/images/gallery/2.jpg',
  2019: '/images/gallery/3.jpg',
};

const years = Object.keys(galleryByYear)
  .sort()
  .map((year) => ({ year, image: covers[year] ?? '/images/placeholder.jpg' }));

function Timeline() {
  /* Sin datos todavia: mismo patron que "Espacio reservado para las ediciones"
     de los programas. Se llena en src/data/presidents.js */
  if (timeline.length === 0) {
    return (
      <div className="timeline-empty">
        <span className="timeline-empty-icon">
          <Icon data={Person} size={26} />
        </span>
        <Text variant="header-2" as="h2" className="timeline-empty-title">
          Espacio reservado para la línea de tiempo de presidentes
        </Text>
        <Text variant="body-2" color="secondary" className="timeline-empty-text">
          Aquí se publicarán los presidentes del CONREVE con su periodo de mandato y los años de
          galería que les corresponden.
        </Text>
      </div>
    );
  }

  return (
    <ol className="timeline">
      {timeline.map((item) => (
        <li key={item.id} className="timeline-item">
          <span className="timeline-marker" aria-hidden="true" />

          <div className="timeline-body">
            <span className="timeline-term">
              <Icon data={Calendar} size={14} className="timeline-term-icon" />
              Mandato {formatTerm(item)}
            </span>

            <div className="timeline-head">
              {item.photo && (
                <span className="timeline-photo">
                  <img src={item.photo} alt={item.name} onError={handleImageError} />
                </span>
              )}
              <div className="timeline-headings">
                <h3 className="timeline-name">{item.name}</h3>
                <span className="timeline-org">
                  {[item.university, item.country].filter(Boolean).join(' · ')}
                </span>
              </div>
            </div>

            {item.session && <p className="timeline-session">{item.session}</p>}
            {item.note && <p className="timeline-note">{item.note}</p>}

            {item.years.length > 0 ? (
              <div className="timeline-years">
                {item.years.map((year) => (
                  <Link key={year} to={`/galeria/${year}`} className="timeline-year">
                    {year}
                    {item.partialYears[year] && <span className="timeline-year-tag">parcial</span>}
                  </Link>
                ))}
              </div>
            ) : (
              <span className="timeline-noyears">Sin galerías publicadas de este periodo</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function GaleriaIndex() {
  /* Mientras la linea de tiempo este vacia el panel reservado va DESPUES de las
     galerias: si va arriba empuja las tarjetas de ano hacia abajo y en celular
     hay que hacer scroll para verlas. Con datos, la linea de tiempo va primero
     porque es el eje de lectura. */
  const timelineLast = timeline.length === 0;

  return (
    <div className="page-wrap">
      <PageHeader
        title="Galería"
        subtitle="Eventos y actividades del SIREVE por año"
        icon={Picture}
      />

      <div className="page-body">
        <div className={`galeria-sections${timelineLast ? ' galeria-sections--timeline-last' : ''}`}>
          <section className="timeline-section">
            <h2 className="timeline-title">Presidentes del CONREVE</h2>
            <p className="timeline-lead">
              Línea de tiempo de los mandatos. Cada presidente aparece una vez por mandato, con los
              años de galería que le corresponden.
            </p>
            <Timeline />
          </section>

          <section className="galeria-years-section">
            <h2 className="timeline-title">Galerías por año</h2>
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
          </section>
        </div>
      </div>
    </div>
  );
}