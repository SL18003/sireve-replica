import { MusicNote, Cup, Medal, HeartPulse, Person } from '@gravity-ui/icons';

/* ---------------------------------------------------------------------------
   Data central de los programas del SIREVE.

   Cada programa tiene:
   - slug / title / subtitle / excerpt / description / icon / image
   - featureImage: grafica destacada de la pagina /programas/:slug (hero).
      Va en public/images/programs/<slug>-about.jpg y es distinta de `image`
      para no repetir la foto del hero en la seccion "El programa".
   - tagline: linea corta bajo el titulo en la pagina del programa.
   - galleryName: nombre corto del programa como seccion de /galeria/<ano>/
      (titulo + ancla #slug de la categoria; si no se pone, se usa `title`).
      Los albums llevan `program: <slug>` en galleryData.json.
   - resources: enlaces reales del programa (carpetas de Drive, galeria,
      reglamentos). Usan `url` (externo, se abre en pestana nueva) o `to`
      (ruta interna de este sitio).
   - editions: historial de ediciones. Hoy lleno solo en `premio-ruben-dario`
      (2025, 2024, 2023, 2020 — de mas reciente a mas antigua); el resto sigue
      vacio y muestra el panel reservado.

   PARA LLENAR EL HISTORIAL MAS ADELANTE (no hace falta tocar componentes):
   1. Logo / mascota / flayer de la edicion:
      - Sube la imagen a: public/images/programs/editions/<slug>-<anio>.png
      - En la edicion, pon:  logo: '/images/programs/editions/ficcua-2024.png'
   2. Anio y sede:
      -  year: 2024, place: 'Ciudad, Pais'
   3. Documentos / enlaces (pueden ser Drive, PDF, galeria o sitios externos):
      -  links: [
           { label: 'Convocatoria 2024', url: 'https://drive.google.com/...' },
           { label: 'Galeria 2024', to: '/galeria/2024' },
         ]

   Ejemplo de una edicion (descomenta dentro del array `editions`):

   editions: [
     {
       year: 2024,
       title: 'FICCUA 2024',        // opcional: si no se pone, se arma con el anio
       logo: '/images/programs/editions/ficcua-2024.png',
       place: 'Ciudad, Pais',
       links: [{ label: 'Convocatoria', url: 'https://...' }],
     },
   ],
--------------------------------------------------------------------------- */

const DRIVE = {
  actasFiccua: 'https://drive.google.com/drive/folders/1DfOaQ_DFvqHXgVvk5X19PlLu44JK_Hc4',
  actasJuduca: 'https://drive.google.com/drive/folders/1Wfw6WwTzJWllWrIAGM6qs_hnoNc3Q35g',
  actasPromotoras: 'https://drive.google.com/drive/folders/1-y2M78ic5uRzOBZKeAF08BqGEkYb1E_W',
  actasConreve: 'https://drive.google.com/drive/folders/1rx_yImAJi__RcTDTp6Mv61FYJ0hc5h1Q',
};

export const programs = [
  {
    slug: 'ficcua',
    title: 'FICCUA',
    galleryName: 'FICCUA',
    subtitle: 'Qué es FICCUA',
    excerpt: 'Festival bienal e itinerante de artistas estudiantiles universitarios de Centroamérica.',
    description:
      'El FICCUA es un evento bienal e itinerante de artistas estudiantiles universitarios, promovido por el Consejo Superior Universitario Centroamericano y la Secretaría Adjunta para Asuntos Estudiantiles. El FICCUA busca promover la educación integral, articulación del estudiantado centroamericano y proyección universitaria de la región en un marco de hermandad, diversidad, equidad e inclusión, mediante la expresión de distintas manifestaciones artísticas.',
    icon: MusicNote,
    image: '/images/programs/ficcua.jpg',
    featureImage: '/images/programs/ficcua-about.jpg',
    tagline: 'Arte universitario, integración estudiantil y proyección regional',
    resources: [
      { icon: 'Folders', label: 'Actas del FICCUA', desc: 'Congresos pre FICCUA en Google Drive', url: DRIVE.actasFiccua },
      { icon: 'Picture', label: 'Galería SIREVE', desc: 'Fotos de eventos y actividades', to: '/galeria' },
      { icon: 'Book', label: 'Reglamento general', desc: 'Normativa vigente del sistema', to: '/reglamentos' },
    ],
    editions: [],
  },
  {
    slug: 'juduca',
    title: 'JUDUCA',
    galleryName: 'JUDUCA',
    subtitle: 'Qué es JUDUCA',
    excerpt: 'Juegos Deportivos Universitarios Centroamericanos para fortalecer la integración regional.',
    description:
      'El Consejo Regional de Vida Estudiantil (CONREVE), órgano del Consejo Superior Universitario Centroamericano (CSUCA), celebra los Juegos Deportivos Universitarios Centroamericanos (JUDUCA) con el objetivo común de contribuir al fortalecimiento de la integración, la solidaridad y la paz entre nuestras universidades de la región.',
    icon: Cup,
    image: '/images/programs/juduca.jpg',
    featureImage: '/images/programs/juduca-about.png',
    tagline: 'Deporte universitario, integración estudiantil y proyección regional',
    resources: [
      { icon: 'Folders', label: 'Actas del JUDUCA', desc: 'Congresos pre JUDUCA en Google Drive', url: DRIVE.actasJuduca },
      { icon: 'Picture', label: 'Galería SIREVE', desc: 'Fotos de eventos y actividades', to: '/galeria' },
      { icon: 'Book', label: 'Reglamento general', desc: 'Normativa vigente del sistema', to: '/reglamentos' },
    ],
    editions: [],
  },
  {
    slug: 'premio-ruben-dario',
    title: 'Excelencia Académica',
    galleryName: 'Premio Rubén Darío',
    subtitle: 'Premio Rubén Darío',
    excerpt: 'Reconocimiento a la excelencia académica de estudiantes destacados de la región.',
    description:
      'El Premio Regional a la Excelencia Académica "Rubén Darío" se establece mediante Acuerdo Noveno de la XIII Sesión Ordinaria del Consejo Regional de Vida Estudiantil, celebrada en la República de Panamá en el mes de mayo del año 2005. Se crea como un reconocimiento para aquellos estudiantes distinguidos académicamente y que sobresalen en el desarrollo del conocimiento científico, tecnológico y humanista de las diversas ramas del saber.',
    icon: Medal,
    image: '/images/programs/excelencia.jpg',
    featureImage: '/images/programs/excelencia-about.jpg',
    tagline:
      'Excelencia académica universitaria, integración estudiantil y proyección regional',
    resources: [
      { icon: 'Folders', label: 'Actas del CONREVE', desc: 'Sesiones del Consejo Regional en Google Drive', url: DRIVE.actasConreve },
      { icon: 'Picture', label: 'Galería SIREVE', desc: 'Fotos de eventos y actividades', to: '/galeria' },
      { icon: 'Book', label: 'Reglamento general', desc: 'Normativa vigente del sistema', to: '/reglamentos' },
    ],
    editions: [
      {
        year: 2025,
        title: 'XX Premio Regional a la Excelencia Académica — 2025',
        logo: '/images/programs/editions/premio-ruben-dario-2025.jpg',
      },
      {
        year: 2024,
        title: 'XIX Premio Regional a la Excelencia Académica — 2024',
        logo: '/images/programs/editions/premio-ruben-dario-2024.jpg',
      },
      {
        year: 2023,
        title: 'XVIII Premio a la Excelencia Académica — 2023',
        logo: '/images/programs/editions/premio-ruben-dario-2023.jpg',
      },
      {
        year: 2020,
        title: 'XV Premio a la Excelencia Académica — 2020',
        logo: '/images/programs/editions/premio-ruben-dario-2020.jpg',
      },
    ],
  },
  {
    slug: 'promotoras-salud',
    title: 'Promotoras de Salud',
    galleryName: 'Promotoras de Salud',
    subtitle: 'Qué son los Promotores de Salud',
    excerpt: 'Red de universidades promotoras de la salud en Centroamérica y el Caribe.',
    description:
      'La Promoción de la Salud es aquella actividad que brinda la oportunidad de promover y concientizar a las personas sobre la prevención y así brindar las herramientas necesarias para un mayor control de la Salud. El cual se ejerce en las universidades a través del Programa de Universidades Promotoras de la Salud y del Sistema Regional de Vida Estudiantil, mediante la Red Centroamericana y Caribeña de Universidades Promotoras de la Salud REDCCUPS.',
    icon: HeartPulse,
    image: '/images/programs/salud.jpg',
    featureImage: '/images/programs/salud-about.jpg',
    tagline: 'Salud universitaria, integración estudiantil y proyección regional',
    resources: [
      { icon: 'Folders', label: 'Actas de Promotoras', desc: 'Asambleas de la REDCCUPS en Google Drive', url: DRIVE.actasPromotoras },
      { icon: 'Picture', label: 'Galería SIREVE', desc: 'Fotos de eventos y actividades', to: '/galeria' },
      { icon: 'Book', label: 'Reglamento general', desc: 'Normativa vigente del sistema', to: '/reglamentos' },
    ],
    editions: [],
  },
  {
    slug: 'voluntariado',
    title: 'Voluntariado',
    galleryName: 'Voluntariado',
    subtitle: 'Red UNIVOCES',
    excerpt: 'Compromiso social universitario a través del voluntariado en la región.',
    description:
      'El voluntariado es el ejercicio libre, organizado y no remunerado de la solidaridad ciudadana en actividades y programas que van en beneficio de la humanidad y su entorno en general. El cual se ejerce en las universidades a través del Programa de Voluntariado del Sistema Regional de Vida Estudiantil, mediante la Red UNIVOCES.',
    icon: Person,
    image: '/images/programs/voluntariado.jpg',
    featureImage: '/images/programs/voluntariado-about.jpg',
    tagline: 'Solidaridad universitaria, integración estudiantil y proyección regional',
    resources: [
      { icon: 'Folders', label: 'Actas del CONREVE', desc: 'Sesiones del Consejo Regional en Google Drive', url: DRIVE.actasConreve },
      { icon: 'Picture', label: 'Galería SIREVE', desc: 'Fotos de eventos y actividades', to: '/galeria' },
      { icon: 'Book', label: 'Reglamento general', desc: 'Normativa vigente del sistema', to: '/reglamentos' },
    ],
    editions: [],
  },
];

export const getProgram = (slug) => programs.find((p) => p.slug === slug);