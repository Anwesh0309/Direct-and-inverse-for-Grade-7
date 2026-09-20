import { pick } from '../random/rng.js';

export const CONTEXT_NAMES = [
  'Emma', 'Lucas', 'Noah', 'Liam', 'Chloe', 
  'Jack', 'Sophia', 'Mason', 'Ava', 'Sam', 'Alex'
];

export const CONTEXT_THEMES = [
  { item: 'bubble tea cups', unit: 'cups', costUnit: 'S$', priceRange: [3, 7] },
  { item: 'MRT train trips', unit: 'trips', costUnit: 'S$', priceRange: [2, 5] },
  { item: 'hawker food trays', unit: 'trays', costUnit: 'S$', priceRange: [4, 8] },
  { item: 'notebooks', unit: 'notebooks', costUnit: 'S$', priceRange: [2, 6] },
  { item: 'sports day ribbons', unit: 'ribbons', costUnit: 'S$', priceRange: [1, 4] },
  { item: 'drone batteries', unit: 'batteries', costUnit: 'S$', priceRange: [12, 25] },
];

export const WORK_THEMES = [
  { workers: 'painters', task: 'paint a school mural', timeUnit: 'hours' },
  { workers: 'volunteers', task: 'pack festival gift bags', timeUnit: 'hours' },
  { workers: '3D printers', task: 'print robot chassis parts', timeUnit: 'hours' },
  { workers: 'water taps', task: 'fill the sports day water cooler', timeUnit: 'minutes' },
  { workers: 'garden sprinklers', task: 'water the school rooftop garden', timeUnit: 'minutes' },
  { workers: 'assembly robots', task: 'package festival lanterns', timeUnit: 'minutes' },
];

export const SPEED_THEMES = [
  { vehicle: 'delivery van', route: 'from the warehouse to Marina Bay' },
  { vehicle: 'Sentosa shuttle bus', route: 'from harbour to the beach' },
  { vehicle: 'electric cargo bike', route: 'across the city park connector' },
  { vehicle: 'speed train', route: 'between city terminal and the airport' },
];

export function getRandomContext(rng) {
  return {
    student: pick(rng, CONTEXT_NAMES),
    friend: pick(rng, CONTEXT_NAMES.filter(n => n !== 'Emma')),
    theme: pick(rng, CONTEXT_THEMES),
    work: pick(rng, WORK_THEMES),
    speed: pick(rng, SPEED_THEMES),
  };
}

export const formatNum = (n) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));
