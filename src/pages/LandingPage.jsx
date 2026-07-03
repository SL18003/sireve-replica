import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Icon } from '@gravity-ui/uikit';
import {
  ShieldCheck, HeartPulse, StarFill, Person,
  ChevronLeft, ChevronRight, Folder, Picture, FileText, ChevronDown,
} from '@gravity-ui/icons';
import { handleImageError } from '../utils/imageFallback';
import './LandingPage.css';

const heroImage = '/images/hero.jpg';

const carouselImages = [
  { url: '/images/carousel/1.jpg', alt: 'Graduación universitaria' },
  { url: '/images/carousel/2.jpg', alt: 'Conferencia académica' },
  { url: '/images/carousel/3.jpg', alt: 'Vida estudiantil' },
];

const heroStats = [
  { value: '30+', label: 'Universidades miembros' },
  { value: '6', label: 'Programas regionales' },
  { value: '8', label: 'Países de la región' },
];

const quickLinks = [
  {
    title: 'Actas SIREVE',
    desc: 'Documentos oficiales del CONREVE y comités',
    icon: Folder,
    path: '/actas',
    image: '/images/quick/actas.jpg',
  },
  {
    title: 'Galería',
    desc: 'Eventos y actividades por año',
    icon: Picture,
    path: '/galeria',
    image: '/images/quick/galeria.jpg',
  },
  {
    title: 'Reglamentos',
    desc: 'Normativas vigentes del sistema',
    icon: FileText,
    path: '/reglamentos',
    image: '/images/quick/reglamentos.jpg',
  },
];

const sections = [
  {
    id: 'sireve',
    title: 'SIREVE',
    subtitle: '¿Qué es SIREVE?',
    excerpt: 'Órgano del CSUCA encargado de coordinar, promover y fortalecer la Vida Estudiantil en las universidades miembros.',
    description: 'El Sistema Regional de Vida Estudiantil (SIREVE), es el órgano del Consejo Superior Universitario Centroamericano CSUCA, que a través del Consejo Regional de Vida Estudiantil (CONREVE), está encargado de coordinar, promover, fortalecer y generar iniciativas, programas y proyectos que impulsen el desarrollo del área de Vida Estudiantil de las Universidades miembros; contribuyendo a la formación integral de profesionales que participen con compromiso social, en la transformación, desarrollo e Integración de los países miembros del Sistema de Integración Centroamericana SICA.',
    icon: ShieldCheck,
    image: '/images/programs/sireve.jpg',
    accent: '#00529b',
  },
  {
    id: 'ficcua',
    title: 'FICCUA',
    subtitle: 'Qué es FICCUA',
    excerpt: 'Festival bienal e itinerante de artistas estudiantiles universitarios de Centroamérica.',
    description: 'El FICCUA es un evento bienal e itinerante de artistas estudiantiles universitarios, promovido por el Consejo Superior Universitario Centroamericano y la Secretaría Adjunta para Asuntos Estudiantiles. El FICCUA busca promover la educación integral, articulación del estudiantado centroamericano y proyección universitaria de la región en un marco de hermandad, diversidad, equidad e inclusión, mediante la expresión de distintas manifestaciones artísticas.',
    icon: StarFill,
    image: '/images/programs/ficcua.jpg',
    accent: '#7c3aed',
  },
  {
    id: 'juduca',
    title: 'JUDUCA',
    subtitle: 'Qué es JUDUCA',
    excerpt: 'Juegos Deportivos Universitarios Centroamericanos para fortalecer la integración regional.',
    description: 'El Consejo Regional de Vida Estudiantil (CONREVE), órgano del Consejo Superior Universitario Centroamericano (CSUCA), celebra los Juegos Deportivos Universitarios Centroamericanos (JUDUCA) con el objetivo común de contribuir al fortalecimiento de la integración, la solidaridad y la paz entre nuestras universidades de la región.',
    icon: StarFill,
    image: '/images/programs/juduca.jpg',
    accent: '#059669',
  },
  {
    id: 'premio-ruben-dario',
    title: 'Excelencia Académica',
    subtitle: 'Premio Rubén Darío',
    excerpt: 'Reconocimiento a la excelencia académica de estudiantes destacados de la región.',
    description: 'El Premio Regional a la Excelencia Académica "Rubén Darío" se establece mediante Acuerdo Noveno de la XIII Sesión Ordinaria del Consejo Regional de Vida Estudiantil, celebrada en la República de Panamá en el mes de mayo del año 2005. Se crea como un reconocimiento para aquellos estudiantes distinguidos académicamente y que sobresalen en el desarrollo del conocimiento científico, tecnológico y humanista de las diversas ramas del saber.',
    icon: StarFill,
    image: '/images/programs/excelencia.jpg',
    accent: '#c9a227',
  },
  {
    id: 'promotoras-salud',
    title: 'Promotoras de Salud',
    subtitle: 'Qué son los Promotores de Salud',
    excerpt: 'Red de universidades promotoras de la salud en Centroamérica y el Caribe.',
    description: 'La Promoción de la Salud es aquella actividad que brinda la oportunidad de Promover y concientizar a las personas sobre la prevención y así brindar las herramientas necesarias para un mayor control de la Salud. El cual se ejerce en las universidades a través del Programa de Universidades Promotoras de la Salud y del Sistema Regional de Vida Estudiantil, mediante la Red Centroamericana y Caribeña de Universidades Promotoras de la Salud REDCCUPS.',
    icon: HeartPulse,
    image: '/images/programs/salud.jpg',
    accent: '#dc2626',
  },
  {
    id: 'voluntariado',
    title: 'Voluntariado',
    subtitle: 'Red UNIVOCES',
    excerpt: 'Compromiso social universitario a través del voluntariado en la región.',
    description: 'El voluntariado es el ejercicio libre, organizado y no remunerado de la solidaridad ciudadana en actividades y programas que van en beneficio de la humanidad y su entorno en general. El cual se ejerce en las universidades a través del Programa de Voluntariado del Sistema Regional de Vida Estudiantil, mediante la Red UNIVOCES.',
    icon: Person,
    image: '/images/programs/voluntariado.jpg',
    accent: '#0891b2',
  },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`fade-section ${inView ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollToPrograms = () => {
    document.getElementById('programas')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing">
      <section className="landing-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="landing-hero-blob landing-hero-blob--1" />
        <div className="landing-hero-blob landing-hero-blob--2" />
        <div className="landing-hero-overlay" />
        <div className="landing-hero-content">
          <img src="/images/logo-sireve.png" alt="SIREVE" className="landing-hero-logo" onError={handleImageError} />
          <span className="landing-hero-chip landing-hero-animate landing-hero-animate--1">
            Consejo Superior Universitario Centroamericano
          </span>
          <Text variant="display-2" className="landing-hero-title landing-hero-animate landing-hero-animate--2">
            Sistema Regional de Vida Estudiantil
          </Text>
          <Text variant="body-2" className="landing-hero-sub landing-hero-animate landing-hero-animate--3">
            Coordinando, promoviendo y fortaleciendo la vida estudiantil en Centroamérica y el Caribe
          </Text>
          <div className="landing-hero-stats landing-hero-animate landing-hero-animate--4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="landing-hero-stat">
                <span className="landing-hero-stat-value">{stat.value}</span>
                <span className="landing-hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="landing-hero-actions landing-hero-animate landing-hero-animate--5">
            <button type="button" className="landing-btn landing-btn-primary" onClick={scrollToPrograms}>
              Explorar programas
            </button>
            <button type="button" className="landing-btn landing-btn-secondary" onClick={() => navigate('/contacto')}>
              Contacto
            </button>
          </div>
        </div>
        <svg className="landing-hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="var(--g-color-base-background)" />
        </svg>
      </section>

      <AnimatedSection>
        <section className="quick-section">
          <div className="section-header">
            <Text variant="display-1" className="section-title">Acceso rápido</Text>
            <Text variant="body-2" className="section-desc">Recursos y documentos del SIREVE</Text>
          </div>
          <div className="quick-grid">
            {quickLinks.map((link) => (
              <article key={link.title} className="quick-card" onClick={() => navigate(link.path)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate(link.path)}>
                <div className="quick-card-image">
                  <img src={link.image} alt={link.title} onError={handleImageError} />
                  <div className="quick-card-image-overlay" />
                </div>
                <div className="quick-card-body">
                  <div className="quick-card-icon">
                    <Icon data={link.icon} size={20} />
                  </div>
                  <h3 className="quick-card-title">{link.title}</h3>
                  <p className="quick-card-desc">{link.desc}</p>
                  <span className="btn-ver quick-card-ver">Ver</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="carousel-section">
          <div className="section-header">
            <Text variant="display-1" className="section-title">Vida estudiantil</Text>
            <Text variant="body-2" className="section-desc">Momentos y actividades de las universidades miembros del CSUCA</Text>
          </div>
          <div className="carousel-container">
            <button type="button" className="carousel-btn carousel-btn-left" onClick={() => setCurrentImgIdx((p) => (p === 0 ? carouselImages.length - 1 : p - 1))} aria-label="Anterior">
              <Icon data={ChevronLeft} size={22} />
            </button>
            <div className="carousel-track">
              {carouselImages.map((img, i) => (
                <div key={img.alt} className={`carousel-slide${i === currentImgIdx ? ' active' : ''}`}>
                  <img src={img.url} alt={img.alt} onError={handleImageError} />
                  <div className="carousel-overlay" />
                </div>
              ))}
            </div>
            <button type="button" className="carousel-btn carousel-btn-right" onClick={() => setCurrentImgIdx((p) => (p + 1) % carouselImages.length)} aria-label="Siguiente">
              <Icon data={ChevronRight} size={22} />
            </button>
            <div className="carousel-dots">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`carousel-dot${i === currentImgIdx ? ' active' : ''}`}
                  onClick={() => setCurrentImgIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="programs-section" id="programas">
          <div className="section-header">
            <Text variant="display-1" className="section-title">Nuestros programas</Text>
            <Text variant="body-2" className="section-desc">Iniciativas del Consejo Regional de Vida Estudiantil (CONREVE)</Text>
          </div>
          <div className="programs-grid">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="program-card"
                style={{ '--program-accent': section.accent }}
              >
                <div className="program-card-image">
                  <img src={section.image} alt={section.title} onError={handleImageError} />
                  <div className="program-card-image-overlay">
                    <div className="program-card-image-badge">
                      <Icon data={section.icon} size={18} />
                    </div>
                    <h3 className="program-card-image-title">{section.title}</h3>
                  </div>
                  <div className="program-card-accent-bar" />
                </div>
                <div className="program-card-body">
                  <span className="program-card-label">{section.subtitle}</span>
                  <p className={`program-card-text${expandedIds.has(section.id) ? ' expanded' : ''}`}>
                    {expandedIds.has(section.id) ? section.description : section.excerpt}
                  </p>
                  <button
                    type="button"
                    className={`program-card-toggle${expandedIds.has(section.id) ? ' active' : ''}`}
                    onClick={() => toggleExpanded(section.id)}
                  >
                    {expandedIds.has(section.id) ? 'Leer menos' : 'Leer más'}
                    <Icon data={ChevronDown} size={14} className={`program-chevron${expandedIds.has(section.id) ? ' open' : ''}`} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
