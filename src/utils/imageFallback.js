export const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

export function handleImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = PLACEHOLDER_IMAGE;
}
