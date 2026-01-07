export function pickLine(lines: string[], seed: string): string {
  if (lines.length === 0) {
    return "The stars are silent today.";
  }

  // Simple hash function to generate a consistent index from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Get absolute value and mod by lines length
  const index = Math.abs(hash) % lines.length;
  return lines[index];
}
