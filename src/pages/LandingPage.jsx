import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Text, Icon } from '@gravity-ui/uikit';
import {
  ChevronLeft, ChevronRight, Folder, Picture, FileText,
  GraduationCap, BookOpen, Globe, ArrowRight,
} from '@gravity-ui/icons';
import { handleImageError } from '../utils/imageFallback';
import { programs } from '../data/programs';
import './LandingPage.css';


const carouselImages = [
  { url: '/images/carousel/1.jpg', alt: 'Autoridades de la CSUCA con las banderas de los países centroamericanos' },
  { url: '/images/carousel/2.jpg', alt: 'Plenaria del 5.º SICEVAES en la UNED de Costa Rica' },
  { url: '/images/carousel/3.jpg', alt: 'Comité del SIREVE en el Auditorio Cora Ferro Calabrese de la UNA' },
];

const heroStats = [
  { value: '30+', label: 'Universidades miembros', icon: GraduationCap },
  { value: '5', label: 'Programas regionales', icon: BookOpen },
  { value: '8', label: 'Países de la región', icon: Globe },
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

const sireveSection = {
  id: 'sireve',
  title: 'SIREVE',
  subtitle: '¿Qué es SIREVE?',
  description: 'El Sistema Regional de Vida Estudiantil (SIREVE), es el órgano del Consejo Superior Universitario Centroamericano CSUCA, que a través del Consejo Regional de Vida Estudiantil (CONREVE), está encargado de coordinar, promover, fortalecer y generar iniciativas, programas y proyectos que impulsen el desarrollo del área de Vida Estudiantil de las Universidades miembros; contribuyendo a la formación integral de profesionales que participen con compromiso social, en la transformación, desarrollo e Integración de los países miembros del Sistema de Integración Centroamericana SICA.',
};

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
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-hero-h1">
            <span className="landing-hero-logo-plate landing-hero-animate landing-hero-animate--1">
              <img
                src="/images/logo-csuca.png"
                alt="SIREVE — Sistema Regional de Vida Estudiantil (CSUCA)"
                className="landing-hero-logo"
                onError={handleImageError}
              />
            </span>
          </h1>
          <Text variant="body-2" className="landing-hero-sub landing-hero-animate landing-hero-animate--2">
            Consejo Superior Universitario Centroamericano
          </Text>
          <div className="landing-hero-stats landing-hero-animate landing-hero-animate--3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="landing-hero-stat">
                <Icon data={stat.icon} size={26} className="landing-hero-stat-icon" />
                <span className="landing-hero-stat-value">{stat.value}</span>
                <span className="landing-hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="landing-hero-actions landing-hero-animate landing-hero-animate--4">
            <button type="button" className="landing-btn landing-btn-primary" onClick={scrollToPrograms}>
              Explorar programas
            </button>
            <button type="button" className="landing-btn landing-btn-secondary" onClick={() => navigate('/contacto')}>
              Contacto
            </button>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section className="sireve-section" id="sireve">
          <div className="sireve-grid">
            <div className="sireve-copy">
              <span className="sireve-eyebrow">{sireveSection.subtitle}</span>
              <h2 className="sireve-title">{sireveSection.title}</h2>
              <span className="sireve-rule" aria-hidden="true" />
              <Text variant="body-2" className="sireve-text">
                {sireveSection.description}
              </Text>
              <button
                type="button"
                className="landing-btn landing-btn-primary sireve-cta"
                onClick={scrollToPrograms}
              >
                Ver programas
              </button>
            </div>
            <div className="sireve-mosaic" aria-hidden="true">
              {programs.map((program) => (
                <div key={program.slug} className="sireve-mosaic-item">
                  <img src={program.image} alt="" onError={handleImageError} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

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
            <Text variant="body-2" className="section-desc">Iniciativas del SIREVE desarrolladas por el Consejo Regional de Vida Estudiantil (CONREVE)</Text>
          </div>
          <div className="programs-grid">
            {programs.map((program) => (
              <article key={program.slug} id={program.slug} className="program-card">
                <div className="program-card-image">
                  <img src={program.image} alt={program.title} onError={handleImageError} />
                  <div className="program-card-image-overlay">
                    <div className="program-card-image-badge">
                      <Icon data={program.icon} size={18} />
                    </div>
                    <h3 className="program-card-image-title">{program.title}</h3>
                  </div>
                  <div className="program-card-accent-bar" />
                </div>
                <div className="program-card-body">
                  <span className="program-card-label">{program.subtitle}</span>
                  <p className="program-card-text">{program.excerpt}</p>
                  <Link to={`/programas/${program.slug}`} className="program-card-cta">
                    Ver programa
                    <Icon data={ArrowRight} size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
