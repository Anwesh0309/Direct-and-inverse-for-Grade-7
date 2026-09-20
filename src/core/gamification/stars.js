export const worldStars = (pct) => {
  if (pct >= 90) return 3;
  if (pct >= 70) return 2;
  if (pct >= 50) return 1;
  return 0;
};

export const stationStars = ({ wrong = 0, hints = 0 }) => {
  if (wrong === 0 && hints === 0) return 3;
  if (wrong <= 2) return 2;
  return 1;
};
