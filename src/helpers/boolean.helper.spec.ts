import { isTrueText } from './boolean.helper';

describe('BooleanHelper', () => {
  describe('isTrueText', () => {
    it('should return true when value is true', () => {
      expect(isTrueText(true)).toBe(true);
    });

    it('should return true when value is "true" as string', () => {
      expect(isTrueText('true')).toBe(true);
    });

    it('should return true when value is "TRUE" as string', () => {
      expect(isTrueText('TRUE')).toBe(true);
    });

    it('should return false when value is false', () => {
      expect(isTrueText(false)).toBe(false);
    });

    it('should return false when value is "false" as string', () => {
      expect(isTrueText('false')).toBe(false);
    });

    it('should return false when value is "1" as string', () => {
      expect(isTrueText('1')).toBe(false);
    });

    it('should return false when value is "" as string', () => {
      expect(isTrueText('')).toBe(false);
    });

    it('should return false when value is undefined as undefined', () => {
      expect(isTrueText(undefined)).toBe(false);
    });

    it('should return false when value is null as undefined', () => {
      expect(isTrueText(null)).toBe(false);
    });
  });
});
