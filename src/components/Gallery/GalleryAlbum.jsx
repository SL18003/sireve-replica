import { useState, useEffect, useCallback } from 'react';
import { Text, Card, Icon } from '@gravity-ui/uikit';
import { ChevronLeft, ChevronRight, Xmark } from '@gravity-ui/icons';
import { handleImageError } from '../../utils/imageFallback';
import './GalleryAlbum.css';

export default function GalleryAlbum({ title, images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = images.length;

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, goPrev, goNext]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  return (
    <>
      <Card view="raised" className="gallery-album">
        <div className="gallery-album-carousel">
          <button
            type="button"
            className="gallery-album-img-btn"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Ampliar imagen de ${title}`}
          >
            <img
              src={images[currentIndex]}
              alt={`${title} — imagen ${currentIndex + 1}`}
              onError={handleImageError}
            />
          </button>

          {total > 1 && (
            <>
              <button type="button" className="gallery-album-nav gallery-album-nav--prev" onClick={goPrev} aria-label="Anterior">
                <Icon data={ChevronLeft} size={20} />
              </button>
              <button type="button" className="gallery-album-nav gallery-album-nav--next" onClick={goNext} aria-label="Siguiente">
                <Icon data={ChevronRight} size={20} />
              </button>
              <span className="gallery-album-counter">{currentIndex + 1} / {total}</span>
              <div className="gallery-album-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`gallery-album-dot${i === currentIndex ? ' active' : ''}`}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Imagen ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="gallery-album-body">
          <Text variant="body-2" className="gallery-album-title">{title}</Text>
          {total > 1 && (
            <Text variant="caption-2" color="secondary" className="gallery-album-meta">
              {total} fotos — clic en la imagen para ampliar
            </Text>
          )}
        </div>
      </Card>

      {lightboxOpen && (
        <div className="gallery-lightbox" onClick={() => setLightboxOpen(false)} role="dialog" aria-modal="true" aria-label={title}>
          <div className="gallery-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gallery-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Cerrar">
              <Icon data={Xmark} size={22} />
            </button>
            <img
              src={images[currentIndex]}
              alt={`${title} — imagen ${currentIndex + 1}`}
              className="gallery-lightbox-img"
              onError={handleImageError}
            />
            {total > 1 && (
              <>
                <button type="button" className="gallery-lightbox-nav gallery-lightbox-nav--prev" onClick={goPrev} aria-label="Anterior">
                  <Icon data={ChevronLeft} size={28} />
                </button>
                <button type="button" className="gallery-lightbox-nav gallery-lightbox-nav--next" onClick={goNext} aria-label="Siguiente">
                  <Icon data={ChevronRight} size={28} />
                </button>
                <div className="gallery-lightbox-footer">
                  <span className="gallery-lightbox-title">{title}</span>
                  <span className="gallery-lightbox-counter">{currentIndex + 1} / {total}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
