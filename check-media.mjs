const res = await fetch('https://sireve.csuca.org/wp-json/wp/v2/media?per_page=100&orderby=date&order=desc');
const items = await res.json();
console.log('total en la libreria:', items.length);
for (const it of items) {
  const sizes = Object.entries(it.media_details?.sizes ?? {})
    .map(([k, v]) => `${k}:${v.width}x${v.height}`)
    .join(' ');
  console.log(`- ${(it.slug ?? '').padEnd(26)} ${String(it.media_details?.width).padStart(5)}x${String(it.media_details?.height).padEnd(5)} ${it.source_url}`);
  console.log(`    alt: ${(it.alt_text ?? '').slice(0, 80)}`);
}
