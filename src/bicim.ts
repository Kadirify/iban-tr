import { ibanTemizle } from './iban.js';

/** 4'erli gruplar: TR33 0006 1005 1978 6457 8413 26 */
export function ibanBicimle(girdi: string): string {
  return ibanTemizle(girdi).replace(/(.{4})(?=.)/g, '$1 ');
}

export interface MaskeSecenekleri {
  /** Sonda açık kalacak karakter, varsayılan 4 */
  son?: number;
  isaret?: string;
  grupla?: boolean;
}

/**
 * Ülke kodu, kontrol haneleri ve son karakterler dışını gizler.
 * TR33 **** **** **** **** **13 26
 */
export function ibanMaskele(girdi: string, s: MaskeSecenekleri = {}): string {
  const iban = ibanTemizle(girdi);
  const son = s.son ?? 4;
  const isaret = s.isaret ?? '*';
  if (!Number.isInteger(son) || son < 0) throw new RangeError(`son 0 ya da pozitif tam sayı olmalı: ${son}`);
  if ([...isaret].length !== 1) throw new RangeError(`isaret tek karakter olmalı: '${isaret}'`);
  const acikSon = Math.min(son, Math.max(iban.length - 4, 0));
  const gizli = iban.length - 4 - acikSon;
  const maskeli = iban.slice(0, 4) + isaret.repeat(Math.max(gizli, 0)) + iban.slice(iban.length - acikSon);
  return s.grupla === false ? maskeli : maskeli.replace(/(.{4})(?=.)/g, '$1 ');
}
