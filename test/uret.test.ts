import { describe, expect, it } from 'vitest';
import { ibanDogrula, ibanUret } from '../src';

describe('ibanUret', () => {
  it('ürettiği her IBAN geçerli ve bankası belli', () => {
    for (let i = 0; i < 500; i++) {
      const s = ibanDogrula(ibanUret());
      expect(s.gecerli, s.iban).toBe(true);
      expect(s.banka, s.iban).toBeDefined();
    }
  });

  it('banka ve hesap verilebiliyor', () => {
    expect(ibanUret({ banka: '0062', hesap: '0000000006298765' })).toBe('TR200006200000000006298765');
    expect(ibanUret({ banka: '00062' }).slice(4, 9)).toBe('00062');
  });

  it('aynı rastgele kaynakla aynı sonuç', () => {
    const kaynak = () => {
      let n = 0;
      return () => (n = (n + 0.37) % 1);
    };
    expect(ibanUret({ rastgele: kaynak() })).toBe(ibanUret({ rastgele: kaynak() }));
  });

  it('hatalı seçenekler', () => {
    expect(() => ibanUret({ banka: '9999' })).toThrow(RangeError);
    expect(() => ibanUret({ banka: '0062', hesap: '123' })).toThrow(RangeError);
  });
});
