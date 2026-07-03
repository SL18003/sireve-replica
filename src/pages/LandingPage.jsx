import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Card, Icon } from '@gravity-ui/uikit';
import { Folder, Picture, FileText, StarFill, HeartPulse, Person, ShieldCheck, ChevronRight } from '@gravity-ui/icons';
import './LandingPage.css';

const carouselSlides = [
  {
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=1400&h=600&fit=crop',
    alt: 'Estudiantes universitarios',
  },
  {
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&h=600&fit=crop',
    alt: 'Graduación',
  },
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=600&fit=crop',
    alt: 'Conferencia',
  },
];

const quickLinks = [
  { title: 'Actas', desc: 'Documentos oficiales', icon: Folder, path: '/actas', color: '#0d9488' },
  { title: 'Galería', desc: 'Eventos y actividades', icon: Picture, path: '/galeria/2019', color: '#7c3aed' },
  { title: 'Reglamentos', desc: 'Normativas vigentes', icon: FileText, path: '/reglamentos', color: '#f59e0b' },
];

const programs = [
  { title: 'SIREVE', desc: 'Sistema Regional de Vida Estudiantil', icon: ShieldCheck, path: '/sireve', color: '#0d9488' },
  { title: 'FICCUA', desc: 'Festival de Cultura y Arte', icon: StarFill, path: '/ficcua', color: '#7c3aed' },
  { title: 'JUDUCA', desc: 'Juegos Deportivos Universitarios', icon: StarFill, path: '/juduca', color: '#f59e0b' },
  { title: 'Premio Rubén Darío', desc: 'Excelencia Académica', icon: StarFill, path: '/excelencia-academica', color: '#ef4444' },
  { title: 'Promotoras de Salud', desc: 'Red de Universidades Saludables', icon: HeartPulse, path: '/promotoras-salud', color: '#ec4899' },
  { title: 'Voluntariado', desc: 'Red UNIVOCES', icon: Person, path: '/voluntariado', color: '#14b8a6' },
];

function useInView(threshold = 0.15) {
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
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % carouselSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-bg">
          {carouselSlides.map((s, i) => (
            <div key={i} className={`hero-bg-slide ${i === slide ? 'active' : ''}`}>
              <img src={s.image} alt={s.alt} />
            </div>
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <Text variant="display-3" className="hero-title">
            Sistema Regional de<br />Vida Estudiantil
          </Text>
          <Text variant="header-1" className="hero-subtitle">
            Coordinando, promoviendo y fortaleciendo la vida estudiantil en Centroamérica
          </Text>
          <div className="hero-actions">
            <button className="hero-btn hero-btn-primary" onClick={() => navigate('/sireve')}>
              Conocer más <Icon data={ChevronRight} size={18} />
            </button>
            <button className="hero-btn hero-btn-secondary" onClick={() => navigate('/contacto')}>
              Contactar
            </button>
          </div>
        </div>

        <div className="hero-dots">
          {carouselSlides.map((_, i) => (
            <button key={i} className={`hero-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      <AnimatedSection>
        <section className="quick-section">
          <div className="section-header">
            <Text variant="display-1" className="section-title">Acceso rápido</Text>
            <Text variant="body-2" className="section-desc">Explora los recursos del SIREVE</Text>
          </div>
          <div className="quick-grid">
            {quickLinks.map((link, i) => (
              <Card key={i} view="raised" type="action" className="quick-card" onClick={() => navigate(link.path)}>
                <div className="quick-card-icon" style={{ background: link.color }}>
                  <Icon data={link.icon} size={28} />
                </div>
                <div>
                  <div className="quick-card-title">{link.title}</div>
                  <div className="quick-card-desc">{link.desc}</div>
                </div>
                <ChevronRight size={20} className="quick-card-arrow" />
              </Card>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="programs-section">
          <div className="section-header">
            <Text variant="display-1" className="section-title">Nuestros programas</Text>
            <Text variant="body-2" className="section-desc">Iniciativas para el desarrollo estudiantil centroamericano</Text>
          </div>
          <div className="programs-grid">
            {programs.map((p, i) => (
              <Card key={i} view="raised" type="action" className={`program-card program-${i}`} onClick={() => navigate(p.path)}>
                <div className="program-card-top" style={{ background: p.color }}>
                  <Icon data={p.icon} size={36} />
                </div>
                <div className="program-card-body">
                  <div className="program-card-title">{p.title}</div>
                  <div className="program-card-desc">{p.desc}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="cta-section">
          <div className="cta-inner">
            <Text variant="display-1" className="cta-title">¿Tienes alguna consulta?</Text>
            <Text variant="body-2" className="cta-desc">Estamos para servirte. Contáctanos y te responderemos a la brevedad.</Text>
            <button className="hero-btn hero-btn-primary" onClick={() => navigate('/contacto')}>
              Ir a Contacto <Icon data={ChevronRight} size={18} />
            </button>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
