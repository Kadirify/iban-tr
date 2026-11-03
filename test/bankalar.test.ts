import { describe, expect, it } from 'vitest';
import { BANKALAR, bankaBul, ibanDogrula } from '../src';

describe('banka listesi', () => {
  it('kodlar benzersiz ve 5 haneli', () => {
    const kodlar = BANKALAR.map((b) => b.kod);
    expect(new Set(kodlar).size).toBe(kodlar.length);
    for (const b of BANKALAR) {
      expect(b.kod, b.ad).toMatch(/^0\d{4}$/);
      expect(b.kod).toBe(`0${b.eftKodu}`);
    }
  });

  it('büyük bankalar doğru kodda', () => {
    expect(bankaBul('0010')?.kisaAd).toBe('Ziraat Bankası');
    expect(bankaBul('0012')?.kisaAd).toBe('Halkbank');
    expect(bankaBul('0015')?.kisaAd).toBe('VakıfBank');
    expect(bankaBul('0046')?.kisaAd).toBe('Akbank');
    expect(bankaBul('0062')?.kisaAd).toBe('Garanti BBVA');
    expect(bankaBul('0064')?.kisaAd).toBe('İş Bankası');
    expect(bankaBul('0067')?.kisaAd).toBe('Yapı Kredi');
    expect(bankaBul('0111')?.kisaAd).toBe('QNB');
    expect(bankaBul('0134')?.kisaAd).toBe('DenizBank');
    expect(bankaBul('0205')?.kisaAd).toBe('Kuveyt Türk');
    expect(bankaBul('0829')?.kisaAd).toBe('Papara');
  });

  it('IBAN, 4 ya da 5 haneli koddan buluyor', () => {
    expect(bankaBul('TR20 0006 2000 0000 0006 2987 65')?.kod).toBe('00062');
    expect(bankaBul('00062')?.kod).toBe('00062');
    expect(bankaBul('9999')).toBeUndefined();
    expect(bankaBul('Garanti')).toBeUndefined();
  });

  it('liste değiştirilemiyor', () => {
    expect(Object.isFrozen(BANKALAR)).toBe(true);
    expect(Object.isFrozen(BANKALAR[0])).toBe(true);
  });
});

describe('doğrulamada banka', () => {
  it('geçerli IBAN bankasıyla geliyor', () => {
    expect(ibanDogrula('TR200006200000000006298765').banka?.kisaAd).toBe('Garanti BBVA');
  });

  it('kontrol hanesi tutmasa da bankayı söylüyor', () => {
    const s = ibanDogrula('TR210006200000000006298765');
    expect(s.gecerli).toBe(false);
    expect(s.banka?.kisaAd).toBe('Garanti BBVA');
  });

  it('listede olmayan kod geçersiz değil, uyarı', () => {
    const s = ibanDogrula('TR330006100519786457841326');
    expect(s.gecerli).toBe(true);
    expect(s.banka).toBeUndefined();
    expect(s.uyari).toBe('Banka kodu listede yok: 00061');
  });
});
