import { useState, useEffect } from 'react';
import { Card, Text, Button, Icon } from '@gravity-ui/uikit';
import { ShieldCheck, HeartPulse, StarFill, Person, ChevronLeft, ChevronRight } from '@gravity-ui/icons';
import './LandingPage.css';

const sections = [
  {
    title: '¿Qué es SIREVE?',
    description: 'El Sistema Regional de Vida Estudiantil (SIREVE), es el órgano del Consejo Superior Universitario Centroamericano CSUCA, que través del Consejo Regional de Vida Estudiantil (CONREVE), está encargado de coordinar, promover, fortalecer y generar iniciativas, programas y proyectos que impulsen el desarrollo del área de Vida Estudiantil de las Universidades miembros; contribuyendo a la formación integral de profesionales que participen con compromiso social, en la transformación, desarrollo e Integración de los países miembros del Sistema de Integración Centroamericana SICA.',
    icon: ShieldCheck,
    color: 'var(--g-color-base-brand)',
  },
  {
    title: 'FICCUA',
    description: 'El FICCUA es un evento bienal e itinerante de artistas estudiantiles universitarios, promovido por el Consejo Superior Universitario Centroamericano y la Secretaría Adjunta para Asuntos Estudiantiles. El FICCUA busca promover la educación integral, articulación del estudiantado centroamericano y proyección universitaria de la región en un marco de hermandad, diversidad, equidad e inclusión, mediante la expresión de distintas manifestaciones artísticas.',
    icon: StarFill,
    color: 'var(--g-color-base-info)',
  },
  {
    title: 'JUDUCA',
    description: 'El Consejo Regional de Vida Estudiantil (CONREVE), órgano del Consejo Superior Universitario Centroamericano (CSUCA), celebra los Juegos Deportivos Universitarios Centroamericanos (JUDUCA) con el objetivo común de contribuir al fortalecimiento de la integración, la solidaridad y la paz entre nuestras universidades de la región.',
    icon: StarFill,
    color: 'var(--g-color-base-warning)',
  },
  {
    title: 'Premio Rubén Darío',
    description: 'El Premio Regional a la Excelencia Académica "Rubén Darío" se establece mediante Acuerdo Noveno de la XIII Sesión Ordinaria del Consejo Regional de Vida Estudiantil, celebrada en la República de Panamá en el mes de mayo del año 2005. Se crea como un reconocimiento para aquellos estudiantes distinguidos académicamente y que sobresalen en el desarrollo del conocimiento científico, tecnológico y humanista de las diversas ramas del saber. El Consejo Regional de Vida Estudiantil a través de este premio reconoce el esfuerzo, perseverancia y constancia en la excelencia académica de las y los estudiantes en las universidades que conforman el Consejo Superior Universitario Centroamericano y República Dominicana.',
    icon: StarFill,
    color: 'var(--g-color-base-positive)',
  },
  {
    title: 'Promotoras de Salud',
    description: 'La Promoción de la Salud es aquella actividad que brinda la oportunidad de Promover y concientizar a las personas sobre la prevención y así brindar las herramientas necesarias para un mayor control de la Salud. El cual se ejerce en las universidades a través del Programa de Universidades Promotoras de la Salud y del Sistema Regional de Vida Estudiantil, mediante la Red Centroamericana y Caribeña de Universidades Promotoras de la Salud REDCCUPS, La cual promueve la Promoción de la salud como actividad de compromiso social universitario que complementa el proceso enseñanza-aprendizaje y el desarrollo integral estudiantil universitario.',
    icon: HeartPulse,
    color: 'var(--g-color-base-danger)',
  },
  {
    title: 'Voluntariado',
    description: 'El voluntariado es el ejercicio libre, organizado y no remunerado de la solidaridad ciudadana en actividades y programas que van en beneficio de la humanidad y su entorno en general. El cual se ejerce en las universidades a través del Programa de Voluntariado del Sistema Regional de Vida Estudiantil, mediante la Red UNIVOCES, el cual promueve el voluntariado como actividad de compromiso social universitario que complementa el proceso enseñanza-aprendizaje y el desarrollo integral estudiantil universitario.',
    icon: Person,
    color: 'var(--g-color-base-special)',
  },
];

export default function LandingPage() {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const carouselImages = [
    { url: 'https://picsum.photos/seed/sansalvador/800/400', alt: 'San Salvador' },
    { url: 'https://picsum.photos/seed/universidad/800/400', alt: 'Universidad' },
    { url: 'https://picsum.photos/seed/estudiantes/800/400', alt: 'Estudiantes' },
    { url: 'https://picsum.photos/seed/campus/800/400', alt: 'Campus' },
    { url: 'https://picsum.photos/seed/centroamerica/800/400', alt: 'Centroamérica' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const handlePrev = () => setCurrentImgIdx(prev => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  const handleNext = () => setCurrentImgIdx(prev => (prev + 1) % carouselImages.length);

  return (
    <div className="landing-container">
      <div className="hero-banner-solid">
        <div className="hero-content">
          <Text variant="display-2" className="landing-title" style={{ color: '#fff' }}>
            Bienvenido a SIREVE
          </Text>
          <div style={{ height: '16px' }}></div>
          <Text variant="header-1" className="landing-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Explora los programas, eventos y recursos de la Vida Estudiantil
          </Text>
        </div>
      </div>

      <div className="carousel-container-single">
        <Button view="flat" size="xl" onClick={handlePrev} className="carousel-btn left">
          <Icon data={ChevronLeft} size={24} />
        </Button>
        
        <img 
          src={carouselImages[currentImgIdx].url} 
          alt={carouselImages[currentImgIdx].alt} 
          className="carousel-image-single" 
        />
        
        <Button view="flat" size="xl" onClick={handleNext} className="carousel-btn right">
          <Icon data={ChevronRight} size={24} />
        </Button>

        <div className="carousel-dots">
          {carouselImages.map((_, idx) => (
            <div 
              key={idx} 
              className={`carousel-dot ${idx === currentImgIdx ? 'active' : ''}`}
              onClick={() => setCurrentImgIdx(idx)}
            />
          ))}
        </div>
      </div>

      <div className="cards-grid">
        {sections.map((section, index) => (
          <Card key={index} className="info-card" view="raised" type="action">
            <div className="info-card-content">
              <div className="icon-wrapper" style={{ color: section.color }}>
                <Icon data={section.icon} size={32} />
              </div>
              <Text variant="header-1" as="h3" className="card-title" style={{ color: '#0d9488' }}>
                {section.title}
              </Text>
              <Text variant="body-2" color="secondary" className="card-desc">
                {section.description}
              </Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
