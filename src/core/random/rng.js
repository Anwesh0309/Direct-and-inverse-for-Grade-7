/**
 * Deterministic Mulberry32 PRNG for reproducible questions
 */
export function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

export function hash(seed, slot, attempt = 0) {
  const s = String(seed) + ':' + String(slot) + ':' + String(attempt);
  return hashString(s);
}

export const randInt = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

export const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

export const shuffle = (rng, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const divisors = (n) => {
  const res = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) res.push(i);
  }
  return res;
};

export const roundTidy = (num, decimals = 2) => {
  if (Number.isInteger(num)) return num;
  return parseFloat(num.toFixed(decimals));
};
