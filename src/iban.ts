export const IBAN_UZUNLUGU = 26;

export type HataKodu = 'bos' | 'karakter' | 'ulke' | 'uzunluk' | 'rezerv' | 'kontrol';

export interface IbanHatasi {
  kod: HataKodu;
  mesaj: string;
}

// Kopyalarken gelen görünmez karakterler: yumuşak tire, sıfır genişlikli boşluk, yön işaretleri
const GORUNMEZ = /[\s\u00ad\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff.\-_/]/g;

/** Boşlukları, tireleri, baştaki "IBAN:" yazısını atar, büyük harfe çevirir. */
export function ibanTemizle(girdi: string): string {
  if (typeof girdi !== 'string') throw new TypeError(`IBAN metin olmalı, gelen: ${typeof girdi}`);
  return girdi
    .normalize('NFKC')
    .replace(GORUNMEZ, '')
    .replace(/^[iİI]BAN(NO|NUMARASI)?:?/i, '')
    .toUpperCase();
}

/** ISO 13616 mod 97. Harfler A=10 ... Z=35 olarak sayılır. */
export function mod97(metin: string): number {
  let kalan = 0;
  for (const h of metin) {
    const kod = h.charCodeAt(0);
    if (kod >= 65 && kod <= 90) {
      const deger = kod - 55;
      kalan = (kalan * 100 + deger) % 97;
    } else {
      kalan = (kalan * 10 + (kod - 48)) % 97;
    }
  }
  return kalan;
}

/** Ülke kodu ve BBAN için iki haneli kontrol numarası. */
export function kontrolHaneleri(ulke: string, bban: string): string {
  const k = 98 - mod97(bban + ulke + '00');
  return k < 10 ? `0${k}` : String(k);
}

/** IBAN geçersizse nedenini, geçerliyse undefined döner. Girdinin temizlenmiş olduğu varsayılır. */
export function ibanHatasi(iban: string): IbanHatasi | undefined {
  if (!iban) return { kod: 'bos', mesaj: 'IBAN boş' };

  const yanlis = /[^A-Z0-9]/u.exec(iban);
  if (yanlis) {
    const h = yanlis[0];
    // görünmeyen karakteri kodu ile göster, yoksa mesajda boş tırnak çıkıyor
    const goster = /^[\p{L}\p{N}\p{P}\p{S}]$/u.test(h) ? `"${h}"` : `U+${h.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;
    return { kod: 'karakter', mesaj: `Geçersiz karakter: ${goster}` };
  }

  if (!/^[A-Z]{2}/.test(iban)) return { kod: 'ulke', mesaj: 'TR ile başlamalı' };
  if (!iban.startsWith('TR')) return { kod: 'ulke', mesaj: `Türk IBAN'ı değil, ${iban.slice(0, 2)} ile başlıyor` };

  const harf = /[A-Z]/.exec(iban.slice(2));
  if (harf) {
    const oneri = harf[0] === 'O' ? ', sıfır olmalı' : harf[0] === 'I' || harf[0] === 'L' ? ', bir olmalı' : '';
    return { kod: 'karakter', mesaj: `"${harf[0]}" harfi var${oneri}` };
  }

  if (iban.length !== IBAN_UZUNLUGU) {
    return { kod: 'uzunluk', mesaj: `${IBAN_UZUNLUGU} karakter olmalı, ${iban.length} var` };
  }
  if (iban[9] !== '0') return { kod: 'rezerv', mesaj: '10. karakter 0 olmalı' };
  const kk = Number(iban.slice(2, 4));
  if (kk < 2 || kk > 98) return { kod: 'kontrol', mesaj: 'Kontrol haneleri 02 ile 98 arasında olmalı' };
  if (mod97(iban.slice(4) + iban.slice(0, 4)) !== 1) {
    return { kod: 'kontrol', mesaj: 'Kontrol hanesi tutmuyor, bir rakam yanlış yazılmış olabilir' };
  }
  return undefined;
}

export interface IbanParcalari {
  ulke: string;
  kontrol: string;
  bankaKodu: string;
  rezerv: string;
  hesap: string;
}

/** TR33 00061 0 0519786457841326 -> parçalar. Geçerlilik kontrol etmez. */
export function ibanParcala(girdi: string): IbanParcalari {
  const iban = ibanTemizle(girdi);
  return {
    ulke: iban.slice(0, 2),
    kontrol: iban.slice(2, 4),
    bankaKodu: iban.slice(4, 9),
    rezerv: iban.slice(9, 10),
    hesap: iban.slice(10),
  };
}
