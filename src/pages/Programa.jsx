import { Link, useParams } from 'react-router-dom';
import { Text, Icon } from '@gravity-ui/uikit';
import {
  ArrowLeft,
  ArrowUpRightFromSquare,
  MapPin,
  CircleXmark,
  Globe,
  CircleInfo,
  Book,
} from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import { getProgram, programs } from '../data/programs';
import { galleryByYear } from '../data/galleryData';
import { handleImageError } from '../utils/imageFallback';
import './Programa.css';

const programMeta = [
  { icon: Globe, label: 'Ámbito', value: 'Regional centroamericano' },
  { icon: CircleInfo, label: 'Órgano', value: 'SIREVE · CONREVE' },
  { icon: Book, label: 'Cobertura', value: '30+ universidades del CSUCA' },
];

export default function Programa() {
  const { slug } = useParams();
  const program = getProgram(slug);

  if (!program) {
    return (
      <div className="page-wrap">
        <PageHeader
          title="Programa no encontrado"
          subtitle="El programa que buscas no existe en este sitio"
          icon={CircleXmark}
        />
        <div className="page-body">
          <div className="program-notfound">
            <Link to="/#programas" className="program-back">
              <Icon data={ArrowLeft} size={16} />
              Volver a programas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const otherPrograms = programs.filter((p) => p.slug !== program.slug);

  return (
    <div className="page-wrap">
      <div className="page-body">
        <Link to="/#programas" className="program-back program-back--top">
          <Icon data={ArrowLeft} size={16} />
          Volver a programas
        </Link>

        {/* Portada del programa */}
        <section className="program-hero">
          <div className="program-hero-copy">
            <span className="program-section-eyebrow">{program.subtitle}</span>
            <h1 className="program-hero-title">{program.title}</h1>
            <span className="program-rule" aria-hidden="true" />
            <p className="program-hero-tagline">{program.tagline}</p>
            <span className="program-hero-kind">Programa regional</span>

            {/* Ficha rapida del programa: 3 datos, sin inventar informacion */}
            <div className="program-meta">
              {programMeta.map((item) => (
                <div key={item.label} className="program-meta-item">
                  <span className="program-meta-icon">
                    <Icon data={item.icon} size={18} />
                  </span>
                  <div className="program-meta-body">
                    <span className="program-meta-label">{item.label}</span>
                    <span className="program-meta-value">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <figure className="program-hero-figure">
            <span className="program-hero-frame" aria-hidden="true" />
            <img
              src={program.featureImage}
              alt={`Gráfica del ${program.title}`}
              onError={handleImageError}
            />
          </figure>
        </section>

        {/* Descripcion oficial */}
        <section className="program-about">
          <div className="program-about-copy">
            <span className="program-section-eyebrow">Sobre el programa</span>
            <h2 className="program-heading">El programa</h2>
            <span className="program-rule" aria-hidden="true" />
            <p className="program-about-text">{program.description}</p>
          </div>
          <figure className="program-about-figure">
            <img src={program.image} alt={program.title} onError={handleImageError} />
          </figure>
        </section>

        {/* Historial de ediciones: hoy es un espacio reservado */}
        <section className="program-editions">
          <span className="program-section-eyebrow">Archivo y documentos</span>
          <h2 className="program-heading">Historial de ediciones</h2>
          <span className="program-rule" aria-hidden="true" />

          {program.editions.length === 0 ? (
            <div className="program-editions-empty">
              <span className="program-editions-empty-icon">
                <Icon data={program.icon} size={26} />
              </span>
              <div className="program-editions-empty-body">
                <Text variant="header-2" as="h3" className="program-editions-empty-title">
                  Espacio reservado para las ediciones
                </Text>
                <Text variant="body-2" color="secondary" className="program-editions-empty-text">
                  Aquí se publicarán la gráfica o mascota, la sede y los documentos de cada
                  edición de {program.title}.
                </Text>
              </div>
            </div>
          ) : (
            <div className="program-editions-list">
              {program.editions.map((edition) => {
                /* Si el ano tiene albums DE ESTE PROGRAMA (campo `program` en
                   galleryData.json), la foto y el chip abren
                   /galeria/<ano>/#<slug>: la pagina del ano agrupa sus albums
                   por secciones y el ancla va a la de este programa. Mismo
                   espejo en build.mjs. */
                const galleryHref =
                  edition.year &&
                  (galleryByYear[String(edition.year)] || []).some(
                    (album) => album.program === program.slug,
                  )
                    ? `/galeria/${edition.year}/#${program.slug}`
                    : null;
                const slotInner = edition.logo ? (
                  <img
                    src={edition.logo}
                    alt={`Gráfica del ${program.title} ${edition.year || ''}`}
                    onError={handleImageError}
                  />
                ) : (
                  <>
                    <Icon data={program.icon} size={26} />
                    <span>{edition.year || 'Edición'}</span>
                  </>
                );

                return (
                  <article key={edition.year || edition.title} className="program-edition">
                    {galleryHref ? (
                      <Link
                        to={galleryHref}
                        className={`program-edition-logo${edition.logo ? ' has-logo' : ''}`}
                        aria-label={`Ver fotos de esta edición${edition.year ? ` ${edition.year}` : ''}`}
                      >
                        {slotInner}
                      </Link>
                    ) : (
                      <div className={`program-edition-logo${edition.logo ? ' has-logo' : ''}`}>
                        {slotInner}
                      </div>
                    )}

                    <div className="program-edition-body">
                      <div className="program-edition-head">
                        <Text variant="header-2" as="h3" className="program-edition-title">
                          {edition.title || `${program.title} ${edition.year || ''}`}
                        </Text>
                        {edition.place && (
                          <span className="program-edition-place">
                            <Icon data={MapPin} size={14} />
                            {edition.place}
                          </span>
                        )}
                      </div>

                      {edition.links?.length > 0 || galleryHref ? (
                        <div className="program-edition-links">
                          {edition.links?.map((link) => (
                            link.to ? (
                              <Link key={link.label} to={link.to} className="program-edition-link">
                                {link.label}
                              </Link>
                            ) : (
                              <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="program-edition-link"
                              >
                                {link.label}
                                <Icon data={ArrowUpRightFromSquare} size={12} />
                              </a>
                            )
                          ))}
                          {galleryHref && (
                            <Link to={galleryHref} className="program-edition-cta">
                              Ver fotos de esta edición →
                            </Link>
                          )}
                        </div>
                      ) : (
                        <p className="program-edition-placeholder">
                          Documentos y enlaces de esta edición — espacio reservado.
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Navegacion entre programas */}
        <section className="program-others">
          <h2 className="program-heading">Otros programas</h2>
          <span className="program-rule" aria-hidden="true" />
          <div className="program-others-grid">
            {otherPrograms.map((other) => (
              <Link key={other.slug} to={`/programas/${other.slug}`} className="program-other-card">
                <span className="program-other-image">
                  <img src={other.image} alt="" onError={handleImageError} />
                </span>
                <span className="program-other-body">
                  <span className="program-other-title">
                    <Icon data={other.icon} size={15} />
                    {other.title}
                  </span>
                  <span className="program-other-sub">{other.subtitle}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}