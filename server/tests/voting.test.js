import { describe, it, expect } from 'vitest';

function applyIdeaVote(current, nextValue) {
  if (current === nextValue) return null;
  return nextValue;
}
describe('idea voting rules', () => {
  it('toggles the same vote and allows changing it', () => {
    expect(applyIdeaVote(1,1)).toBeNull();
    expect(applyIdeaVote(1,-1)).toBe(-1);
  });
});
