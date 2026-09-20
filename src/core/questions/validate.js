/**
 * Validates runtime generated question objects
 */
export function validateQuestion(q) {
  if (!q) return false;
  if (!q.stem || typeof q.stem !== 'string' || q.stem.trim().length === 0) return false;
  if (q.stem.length > 280) return false;

  // Options validation
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;

  const optionSet = new Set(q.options.map(o => String(o).trim().toLowerCase()));
  if (optionSet.size !== 4) return false; // Must be 4 distinct options

  if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) return false;

  const correctOption = q.options[q.correctIndex];
  if (!correctOption) return false;

  // Answer validation
  if (q.solve && typeof q.solve === 'function') {
    try {
      const solved = q.solve();
      if (solved !== undefined && solved !== null) {
        const strSolved = String(solved).trim();
        const strAnswer = String(q.answer).trim();
        if (strSolved !== strAnswer && !correctOption.includes(strSolved)) {
          // Allow minor floating rounding tolerance
          const numSolved = parseFloat(strSolved);
          const numAnswer = parseFloat(strAnswer);
          if (isNaN(numSolved) || isNaN(numAnswer) || Math.abs(numSolved - numAnswer) > 0.05) {
            return false;
          }
        }
      }
    } catch (e) {
      return false;
    }
  }

  // Hints & solution
  if (!Array.isArray(q.hints) || q.hints.length < 2) return false;
  if (!Array.isArray(q.solution) || q.solution.length < 1) return false;

  return true;
}
