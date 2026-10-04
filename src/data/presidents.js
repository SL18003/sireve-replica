import { galleryByYear } from './galleryData';

/*
 * PRESIDENCIAS DEL CONREVE = linea de tiempo de la galeria (/galeria)
 *
 * El CONREVE (Consejo Regional de Vida Estudiantil) es el organo maximo de
 * decision del SIREVE. Su Comite Directivo se elige en sesion ordinaria y los
 * mandatos duran 2 anos, con las elecciones a mitad de ano (julio 2019, julio
 * 2021, julio 2023, mayo 2025). Por eso un mismo ano puede pertenecer a DOS
 * presidentes y el ano NO puede ser el eje: aqui el eje es el mandato y el ano
 * cuelga de el.
 *
 * ---- COMO LLENARLO (el usuario todavia no tiene los datos) ----
 * 1. Copia uno de los ejemplos comentados de abajo, descomentalo y ajustalo.
 *    Nada se publica mientras `presidents` siga vacio.
 * 2. Foto opcional: subela a public/images/presidents/<id>.jpg. Sin foto, la
 *    ficha se muestra solo con texto.
 * 3. `termFrom` / `termTo` aceptan "2021" o "2021-07". Con mes es mejor, porque
 *    las elecciones son a mitad de ano.
 * 4. Un bloque POR MANDATO: si alguien fue relegido, van dos bloques (el que
 *    termino y el nuevo), no uno largo.
 *
 * Ejemplo con datos verificados en csuca.org, DESACTIVADO a proposito para no
 * publicar nada sin que el usuario lo confirme:
 *
 * {
 *   id: 'jorge-cortez-2023-2025',
 *   name: 'Jorge Cortez Martinez',
 *   university: 'Universidad de El Salvador',
 *   country: 'El Salvador',
 *   termFrom: '2023-07',
 *   termTo: '2025-05',
 *   session: '49 Sesion Ordinaria del CONREVE, julio 2023',
 *   note: 'Reelegido en la LIII Sesion Ordinaria (UNAH, mayo 2025).',
 *   photo: '/images/presidents/jorge-cortez.jpg',
 * },
 * // el mismo presidente, nuevo mandato:
 * {
 *   id: 'jorge-cortez-2025-2027',
 *   name: 'Jorge Cortez Martinez',
 *   university: 'Universidad de El Salvador',
 *   country: 'El Salvador',
 *   termFrom: '2025-05',
 *   termTo: '2027-05',
 *   session: 'LIII Sesion Ordinaria del CONREVE, mayo 2025',
 * },
 */

export const presidents = [];

/* Acepta 2021 o 2021-07; devuelve { year, month } con month = null si no vino */
const TERM_RE = /^(\d{4})(?:-(\d{1,2}))?$/;

function parseTerm(value) {
  if (value === null || value === undefined || value === '') return null;
  const match = TERM_RE.exec(String(value).trim());
  if (!match) return null;
  const month = match[2] ? Math.min(12, Math.max(1, Number(match[2]))) : null;
  return { year: Number(match[1]), month };
}

/* Cuantos meses de `year` cubre este mandato (0 si no lo toca) */
function coveredMonths(from, to, year) {
  if (!from || !to) return 0;
  if (year < from.year || year > to.year) return 0;
  const start = year === from.year ? (from.month ?? 1) : 1;
  const end = year === to.year ? (to.month ?? 12) : 12;
  return Math.max(0, end - start + 1);
}

/*
 * Cada ano con galeria se asigna al presidente con mas meses de ese ano. Solo
 * se usan los anos que existen en `galleryByYear`, asi que la linea de tiempo
 * nunca genera enlaces rotos.
 */
function buildTimeline() {
  const galleryYears = Object.keys(galleryByYear).sort();
  const items = presidents.map((president) => ({ ...president, years: [], partialYears: {} }));

  for (const year of galleryYears) {
    const numericYear = Number(year);
    let best = null;
    let bestMonths = 0;
    let bestOrder = -1;

    for (const item of items) {
      const from = parseTerm(item.termFrom);
      const to = parseTerm(item.termTo);
      const months = coveredMonths(from, to, numericYear);
      if (months === 0) continue;

      const order = from.year * 12 + (from.month ?? 1);
      /* Empate = ano de transicion (p.ej. julio 2019): gana el presidente que
         entro despues, que es el vigente al cierre de ese ano. */
      if (months > bestMonths || (months === bestMonths && order > bestOrder)) {
        best = item;
        bestMonths = months;
        bestOrder = order;
      }
    }

    if (best) {
      best.years.push(year);
      if (bestMonths < 12) best.partialYears[year] = bestMonths;
    }
  }

  return items;
}

export const timeline = buildTimeline();

export function getPresidentForYear(year) {
  const key = String(year);
  for (const item of timeline) {
    if (!item.years.includes(key)) continue;
    return {
      name: item.name,
      university: item.university,
      country: item.country,
      termFrom: item.termFrom,
      termTo: item.termTo,
      /* Meses de ese ano que cubre el mandato; < 12 = ano de transicion */
      partial: item.partialYears[key] ?? null,
    };
  }
  return null;
}

export function formatTerm(item) {
  const from = parseTerm(item.termFrom);
  const to = parseTerm(item.termTo);
  return `${from ? from.year : ''} - ${to ? to.year : ''}`;
}