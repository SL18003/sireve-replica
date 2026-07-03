import rawGalleryData from './galleryData.json';

const placeholderAlbumImages = [
  '/images/gallery/1.jpg',
  '/images/gallery/2.jpg',
  '/images/gallery/3.jpg',
  '/images/gallery/4.jpg',
];

const fallback2019 = [
  { id: '1', title: 'Sesión Ordinaria CONREVE — Panamá, mayo 2019', images: placeholderAlbumImages },
  { id: '2', title: 'Pre-FICCUA Guatemala 2019', images: placeholderAlbumImages.slice(1) },
  { id: '3', title: 'Pre-JUDUCA El Salvador 2019', images: placeholderAlbumImages },
  { id: '4', title: 'Jornada de Integración Estudiantil Centroamericana', images: placeholderAlbumImages.slice(0, 3) },
  { id: '5', title: 'Taller de Liderazgo Estudiantil CSUCA', images: placeholderAlbumImages },
  { id: '6', title: 'Actividades de Voluntariado Regional 2019', images: placeholderAlbumImages.slice(2) },
];

function getYearAlbums(year) {
  const data = rawGalleryData[year];
  return Array.isArray(data) && data.length > 0 ? data : null;
}

export const galleryByYear = {
  '2017': getYearAlbums('2017') ?? [],
  '2018': getYearAlbums('2018') ?? [],
  '2019': getYearAlbums('2019') ?? fallback2019,
};
