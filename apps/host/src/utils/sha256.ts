import * as crypto from 'crypto';
export const sha256 = (text: string, salt: string) => {
  const hash = crypto.createHash('sha256'); /** Hashing algorithm sha512 */
  hash.update(text + salt);
  const value = hash.digest('hex');
  return {
    salt: salt,
    hash: value
  };
};