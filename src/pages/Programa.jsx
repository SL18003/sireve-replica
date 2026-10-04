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
      <PageHeader title={program.title} subtitle={program.subtitle} icon={program.icon} />

      <div className="page-body">
        {/* Ficha rapida del programa */}
        <section className="program-meta">
          {programMeta.map((item) => (
            <div key={item.label} className="program-meta-item">
              <Icon data={item.icon} size={20} className="program-meta-icon" />
              <div>
                <span className="program-meta-label">{item.label}</span>
                <span className="program-meta-value">{item.value}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Descripcion oficial */}
        <section className="program-about">
          <div className="program-about-copy">
            <h2 className="program-heading">El programa</h2>
            <span className="program-rule" aria-hidden="true" />
            <Text variant="body-2" className="program-about-text">
              {program.description}
            </Text>
          </div>
          <figure className="program-about-figure">
            <img src={program.image} alt={program.title} onError={handleImageError} />
          </figure>
        </section>

        {/* Historial de ediciones: hoy es un espacio reservado */}
        <section className="program-editions">
          <h2 className="program-heading">Historial de ediciones</h2>
          <span className="program-rule" aria-hidden="true" />

          {program.editions.length === 0 ? (
            <div className="program-editions-empty">
              <span className="program-editions-empty-icon">
                <Icon data={program.icon} size={26} />
              </span>
              <Text variant="header-2" as="h3" className="program-editions-empty-title">
                Espacio reservado para las ediciones
              </Text>
              <Text variant="body-2" color="secondary" className="program-editions-empty-text">
                Aquí se publicarán la gráfica o mascota, la sede y los documentos de cada
                edición de {program.title}.
              </Text>
            </div>
          ) : (
            <div className="program-editions-list">
              {program.editions.map((edition) => (
                <article key={edition.year || edition.title} className="program-edition">
                  <div className={`program-edition-logo${edition.logo ? ' has-logo' : ''}`}>
                    {edition.logo ? (
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
                    )}
                  </div>

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

                    {edition.links?.length > 0 ? (
                      <div className="program-edition-links">
                        {edition.links.map((link) => (
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
                      </div>
                    ) : (
                      <p className="program-edition-placeholder">
                        Documentos y enlaces de esta edición — espacio reservado.
                      </p>
                    )}
                  </div>
                </article>
              ))}
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

        <Link to="/#programas" className="program-back">
          <Icon data={ArrowLeft} size={16} />
          Volver a programas
        </Link>
      </div>
    </div>
  );
}