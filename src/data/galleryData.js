import rawGalleryData from './galleryData.json';

const placeholderAlbumImages = [
  '/images/gallery/1.jpg',
  '/images/gallery/2.jpg',
  '/images/gallery/3.jpg',
  '/images/gallery/4.jpg',
];

/* "program" (slug) clasifica el album dentro de /galeria/<ano>/: cada programa
   con albums propios forma una seccion con titulo y ancla (#slug) a la que
   enlaza la edicion del programa. Sin "program" va a "Otros eventos".
   Mismo campo y regla en galleryData.json y en wordpress/build.mjs. */
const fallback2019 = [
  { id: '1', title: 'Sesión Ordinaria CONREVE — Panamá, mayo 2019', images: placeholderAlbumImages },
  { id: '2', title: 'Pre-FICCUA Guatemala 2019', images: placeholderAlbumImages.slice(1), program: 'ficcua' },
  { id: '3', title: 'Pre-JUDUCA El Salvador 2019', images: placeholderAlbumImages, program: 'juduca' },
  { id: '4', title: 'Jornada de Integración Estudiantil Centroamericana', images: placeholderAlbumImages.slice(0, 3) },
  { id: '5', title: 'Taller de Liderazgo Estudiantil CSUCA', images: placeholderAlbumImages },
  { id: '6', title: 'Actividades de Voluntariado Regional 2019', images: placeholderAlbumImages.slice(2), program: 'voluntariado' },
];

function getYearAlbums(year) {
  const data = rawGalleryData[year];
  return Array.isArray(data) && data.length > 0 ? data : null;
}

export const galleryByYear = {
  '2017': getYearAlbums('2017') ?? [],
  '2018': getYearAlbums('2018') ?? [],
  '2019': getYearAlbums('2019') ?? fallback2019,
  /* Anos del Premio Ruben Dario (fotos aportadas, en public/images/gallery/premio/).
     Son los destinos de los enlaces del historial de ediciones. */
  '2020': getYearAlbums('2020') ?? [],
  '2023': getYearAlbums('2023') ?? [],
  '2024': getYearAlbums('2024') ?? [],
  '2025': getYearAlbums('2025') ?? [],
};
