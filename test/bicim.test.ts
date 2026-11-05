import { describe, expect, it } from 'vitest';
import { ibanBicimle, ibanMaskele } from '../src';

const IBAN = 'TR330006100519786457841326';

describe('ibanBicimle', () => {
  it('4 erli gruplar', () => {
    expect(ibanBicimle(IBAN)).toBe('TR33 0006 1005 1978 6457 8413 26');
    expect(ibanBicimle('tr33-0006-1005-1978-6457-8413-26')).toBe('TR33 0006 1005 1978 6457 8413 26');
  });

  it('kısa girdide sonda boşluk bırakmıyor', () => {
    expect(ibanBicimle('TR3300')).toBe('TR33 00');
    expect(ibanBicimle('TR33')).toBe('TR33');
  });
});

describe('ibanMaskele', () => {
  it('varsayılan', () => {
    expect(ibanMaskele(IBAN)).toBe('TR33 **** **** **** **** **13 26');
  });

  it('seçenekler', () => {
    expect(ibanMaskele(IBAN, { son: 0 })).toBe('TR33 **** **** **** **** **** **');
    expect(ibanMaskele(IBAN, { isaret: '•', grupla: false })).toBe('TR33••••••••••••••••••1326');
  });

  it('kısa girdide patlamıyor', () => {
    expect(ibanMaskele('TR33')).toBe('TR33');
    expect(ibanMaskele('TR3312', { son: 4 })).toBe('TR33 12');
  });

  it('geçersiz son', () => {
    expect(() => ibanMaskele(IBAN, { son: -1 })).toThrow(RangeError);
  });
});
