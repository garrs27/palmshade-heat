// Xorshift keeps the generated city reproducible for a given seed.
export function createRandom(seed = 1) {
  let state = (seed >>> 0) || 1;
  return function randomWorldValue() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}
