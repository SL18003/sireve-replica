import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Text, Skeleton, Icon } from '@gravity-ui/uikit';
import { Calendar, Picture, Person } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import GalleryAlbum from '../components/Gallery/GalleryAlbum';
import { galleryByYear } from '../data/galleryData';
import { programs } from '../data/programs';
import { getPresidentForYear, formatTerm } from '../data/presidents';
import './Galeria.css';

/* La galeria se clasifica por ano y por programa: los albums con `program`
   (galleryData.json / fallback2019) forman una seccion por programa en el
   orden de programs.js, y lo demas queda en "Otros eventos" al final. Cada
   seccion es un <section id="<slug>">: la edicion del programa enlaza
   /galeria/<ano>/#<slug> y el efecto de hash de abajo hace el scroll.
   Mismo agrupamiento en wordpress/build.mjs (galeriaYear). */
function groupByProgram(albums) {
  const groups = programs
    .map((p) => ({
      slug: p.slug,
      name: p.galleryName || p.title,
      albums: albums.filter((a) => a.program === p.slug),
    }))
    .filter((g) => g.albums.length > 0);

  const others = albums.filter((a) => !a.program);
  if (others.length > 0) {
    groups.push({ slug: 'otros', name: 'Otros eventos', albums: others });
  }
  return groups;
}

export default function Galeria() {
  const { year } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [year]);

  const items = galleryByYear[year] || [];
  /* Solo aparece cuando el usuario llene src/data/presidents.js */
  const president = getPresidentForYear(year);

   /* Scroll al ancla (#premio-ruben-dario, etc.) DESPUES del skeleton: al
      montar, el section todavia no existe y el ScrollToTop de App.jsx deja la
      pagina arriba. Mismo patron que Header.jsx para /#programas. Salto
      instantaneo (no 'smooth'): es una llegada de otra pagina, igual que el
      fragment nativo del lado estatico, y ademas el smooth no avanza en
      headless. */
  useEffect(() => {
    if (isLoading) return undefined;
    const id = location.hash.slice(1);
    if (!id) return undefined;
    const el = document.getElementById(id);
    if (!el) return undefined;
    const timer = setTimeout(() => el.scrollIntoView({ block: 'start' }), 150);
    return () => clearTimeout(timer);
  }, [isLoading, location.hash]);

  const sections = groupByProgram(items);

  return (
    <div className="page-wrap">
      <PageHeader
        title={`Galería ${year}`}
        subtitle="Eventos y actividades del SIREVE"
        icon={Picture}
      />
      <div className="page-body">
        {president && (
          <div className="galeria-context">
            <span className="galeria-context-icon">
              <Icon data={Person} size={18} />
            </span>
            <span className="galeria-context-text">
              <strong>Presidente del CONREVE en {year}:</strong> {president.name}
              {president.university ? ` · ${president.university}` : ''}
              <span className="galeria-context-term">
                <Icon data={Calendar} size={13} className="galeria-context-term-icon" />
                mandato {formatTerm(president)}
                {president.partial && ' (año de transición)'}
              </span>
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="galeria-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="galeria-skeleton">
                <Skeleton style={{ width: '100%', height: 240, borderRadius: 12 }} />
                <Skeleton style={{ height: 18, width: '90%', borderRadius: 4, marginTop: 16 }} />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="galeria-categories">
            {sections.map((section) => (
              <section
                key={section.slug}
                id={section.slug}
                className="galeria-category"
              >
                <h2 className="galeria-category-title">{section.name}</h2>
                <div className="galeria-grid">
                  {section.albums.map((item) => (
                    <GalleryAlbum
                      key={item.id}
                      title={item.title}
                      images={item.images}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="galeria-empty">
            <Text variant="body-2" color="secondary">
              No hay eventos registrados para el año {year}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
