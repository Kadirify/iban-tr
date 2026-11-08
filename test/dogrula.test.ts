import { describe, expect, it } from 'vitest';
import { ibanDogrula, ibanGecerliMi, ibanParcala, ibanTemizle, kontrolHaneleri } from '../src';
import { mod97 } from '../src/iban';

const GECERLI = [
  'TR330006100519786457841326',
  'TR680001000000123456789012',
  'TR670004600000000000012345',
  'TR200006200000000006298765',
  'TR190082900000000000000042',
];

describe('ibanTemizle', () => {
  it('boşluk, tire ve önek', () => {
    expect(ibanTemizle('tr33 0006 1005 1978 6457 8413 26')).toBe('TR330006100519786457841326');
    expect(ibanTemizle('IBAN: TR33-0006-1005-1978-6457-8413-26')).toBe('TR330006100519786457841326');
    expect(ibanTemizle(' TR33\u00a00006\u200b1005 1978 6457 8413 26 ')).toBe('TR330006100519786457841326');
  });

  it('yön işaretleri, yumuşak tire ve Türkçe İBAN öneki', () => {
    const temiz = 'TR330006100519786457841326';
    expect(ibanTemizle('TR33\u00ad0006\u200e1005 1978 6457 8413 26')).toBe(temiz);
    expect(ibanTemizle('\u202aTR330006100519786457841326\u202c')).toBe(temiz);
    expect(ibanTemizle('İBAN: TR33 0006 1005 1978 6457 8413 26')).toBe(temiz);
    expect(ibanTemizle('IBAN No: TR33 0006 1005 1978 6457 8413 26')).toBe(temiz);
    expect(ibanTemizle('IBAN Numarası: TR33 0006 1005 1978 6457 8413 26')).toBe(temiz);
    expect(ibanTemizle('iban numarası: TR33 0006 1005 1978 6457 8413 26')).toBe(temiz);
  });

  it('görünmeyen ya da çok parçalı karakteri anlaşılır gösteriyor', () => {
    expect(ibanDogrula('TR33\u00070006').hata?.mesaj).toBe('Geçersiz karakter: U+0007');
    expect(ibanDogrula('TR33\ud83d\ude000006').hata?.mesaj).toBe('Geçersiz karakter: "\ud83d\ude00"');
  });
});

describe('ibanDogrula', () => {
  it.each(GECERLI)('%s geçerli', (iban) => {
    const s = ibanDogrula(iban);
    expect(s.gecerli).toBe(true);
    expect(s.iban).toBe(iban);
    expect(ibanGecerliMi(iban)).toBe(true);
  });

  it('biçimli yazımı da kabul ediyor', () => {
    expect(ibanGecerliMi('TR33 0006 1005 1978 6457 8413 26')).toBe(true);
  });

  it.each([
    ['', 'bos'],
    ['TR33 0006 1005 1978 6457 8413 2*', 'karakter'],
    ['DE89370400440532013000', 'ulke'],
    ['330006100519786457841326', 'ulke'],
    ['TR33000610051978645784132', 'uzunluk'],
    ['TR3300061005197864578413266', 'uzunluk'],
    ['TR330006110519786457841326', 'rezerv'],
    ['TR330006100519786457841327', 'kontrol'],
    ['TR33O006100519786457841326', 'karakter'],
  ])('%s -> %s', (iban, kod) => {
    const s = ibanDogrula(iban);
    expect(s.gecerli).toBe(false);
    expect(s.hata?.kod).toBe(kod);
  });

  it('hata mesajları ne olduğunu söylüyor', () => {
    expect(ibanDogrula('TR33000610051978645784132').hata?.mesaj).toBe('26 karakter olmalı, 25 var');
    expect(ibanDogrula('TR33O006100519786457841326').hata?.mesaj).toBe('"O" harfi var, sıfır olmalı');
    expect(ibanDogrula('DE89370400440532013000').hata?.mesaj).toBe("Türk IBAN'ı değil, DE ile başlıyor");
  });

  it('yan yana iki rakamın yer değiştirmesini yakalıyor', () => {
    const iban = GECERLI[0]!;
    for (let i = 4; i < iban.length - 1; i++) {
      if (iban[i] === iban[i + 1]) continue;
      const bozuk = iban.slice(0, i) + iban[i + 1] + iban[i] + iban.slice(i + 2);
      expect(ibanGecerliMi(bozuk), bozuk).toBe(false);
    }
  });

  it('tek rakam hatasını yakalıyor', () => {
    const iban = GECERLI[1]!;
    for (let i = 4; i < iban.length; i++) {
      for (let r = 0; r <= 9; r++) {
        if (String(r) === iban[i]) continue;
        const bozuk = iban.slice(0, i) + r + iban.slice(i + 1);
        expect(ibanGecerliMi(bozuk), bozuk).toBe(false);
      }
    }
  });

  it('00, 01 ve 99 kontrol hanesi geçersiz', () => {
    // mod 97 tutsa bile: 99 = 02, 00 = 97 (mod 97)
    expect(ibanGecerliMi('TR990001001777740266462208')).toBe(false);
    expect(ibanGecerliMi('TR000003205032477938551550')).toBe(false);
    expect(ibanDogrula('TR990001001777740266462208').hata?.kod).toBe('kontrol');
  });

  it('metin olmayan girdi', () => {
    expect(ibanGecerliMi(123 as unknown as string)).toBe(false);
    expect(() => ibanDogrula(null as unknown as string)).toThrow(TypeError);
  });
});

describe('kontrol hanesi', () => {
  it('mod 97', () => {
    expect(mod97('0006100519786457841326TR33')).toBe(1);
  });

  it('kontrolHaneleri bağımsız hesapla aynı', () => {
    for (const iban of GECERLI) expect(kontrolHaneleri('TR', iban.slice(4))).toBe(iban.slice(2, 4));
    expect(kontrolHaneleri('tr', '0006100519786457841326')).toBe('33');
    expect(() => kontrolHaneleri('TR', '00-06')).toThrow(RangeError);
  });
});

describe('ibanParcala', () => {
  it('parçalar', () => {
    expect(ibanParcala('TR33 0006 1005 1978 6457 8413 26')).toEqual({
      ulke: 'TR',
      kontrol: '33',
      bankaKodu: '00061',
      rezerv: '0',
      hesap: '0519786457841326',
    });
  });
});
