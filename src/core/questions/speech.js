/**
 * Speech normalizer for natural TTS audio rendering
 */
export function normalizeForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/S\$(\d+(\.\d+)?)/g, '$1 Singapore dollars')
    .replace(/RM\s*(\d+(\.\d+)?)/g, '$1 ringgit')
    .replace(/km\/h/g, 'kilometres per hour')
    .replace(/m\/s/g, 'metres per second')
    .replace(/y\s*=\s*(\d+)x/g, 'y equals $1 x')
    .replace(/y\s*=\s*(\d+)\/x/g, 'y equals $1 over x')
    .replace(/xy\s*=\s*(\d+)/g, 'x y equals $1')
    .replace(/(\d+)\s*×\s*(\d+)/g, '$1 times $2')
    .replace(/(\d+)\s*÷\s*(\d+)/g, '$1 divided by $2')
    .replace(/(\d+):(\d+)/g, '$1 to $2')
    .replace(/k\s*=\s*/g, 'kay equals ')
    .replace(/([0-9]+)\s*cm\b/g, '$1 centimetres')
    .replace(/([0-9]+)\s*km\b/g, '$1 kilometres')
    .replace(/([0-9]+)\s*min\b/g, '$1 minutes')
    .replace(/([0-9]+)\s*h\b/g, '$1 hours');
}
