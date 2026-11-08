import { BANKALAR, bankaBul } from './bankalar.js';
import { kontrolHaneleri } from './iban.js';

export interface UretSecenekleri {
  /** EFT ya da IBAN banka kodu: '0062', '00062'. Verilmezse listeden rastgele bir banka. */
  banka?: string;
  hesap?: string;
  /** Varsayılan Math.random */
  rastgele?: () => number;
}

/**
 * Kontrol hanesi doğru, test için IBAN üretir. Gerçek bir hesaba karşılık gelmez.
 */
export function ibanUret(s: UretSecenekleri = {}): string {
  const r = s.rastgele ?? Math.random;

  let kod: string;
  if (s.banka !== undefined) {
    const b = bankaBul(s.banka);
    if (!b) throw new RangeError(`Bilinmeyen banka kodu: ${s.banka}`);
    kod = b.kod;
  } else {
    const bankalar = BANKALAR.filter((b) => b.tur === 'banka' || b.tur === 'katilim');
    const i = Math.min(Math.floor(r() * bankalar.length), bankalar.length - 1);
    kod = bankalar[Math.max(i, 0)]!.kod;
  }

  let hesap = s.hesap;
  if (hesap === undefined) {
    hesap = '';
    for (let i = 0; i < 16; i++) hesap += Math.min(Math.floor(r() * 10), 9);
  } else if (!/^\d{16}$/.test(hesap)) {
    throw new RangeError(`Hesap kısmı 16 rakam olmalı: ${hesap}`);
  }

  const bban = `${kod}0${hesap}`;
  return `TR${kontrolHaneleri('TR', bban)}${bban}`;
}
