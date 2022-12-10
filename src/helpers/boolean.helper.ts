/**
 * Verify if value as string is 'true'
 * @param value
 * @returns
 * @example
 * isTrueText(true) // true
 * isTrueText('true') // true
 * isTrueText('TRUE') // true
 * isTrueText(false) // false
 * isTrueText('false') // false
 * isTrueText('FALSE') // false
 * isTrueText('1') // false
 * isTrueText('0') // false
 */
export function isTrueText(value: string | boolean): boolean {
  return !!value && value.toString().toLowerCase() === true.toString();
}
