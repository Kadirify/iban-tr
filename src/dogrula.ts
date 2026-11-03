import { bankaBul, type Banka } from './bankalar';
import { IBAN_UZUNLUGU, ibanHatasi, ibanTemizle, type IbanHatasi } from './iban';

export interface DogrulamaSonucu {
  gecerli: boolean;
  /** Temizlenmiş hali: TR330006100519786457841326 */
  iban: string;
  hata?: IbanHatasi;
  /** Banka kodu listede varsa. IBAN geçersiz ama uzunluğu doğruysa da dolu gelir. */
  banka?: Banka;
  /** Geçerli ama banka kodu listede yok. Yeni kurulan bir banka olabilir. */
  uyari?: string;
}

export function ibanDogrula(girdi: string): DogrulamaSonucu {
  const iban = ibanTemizle(girdi);
  const hata = ibanHatasi(iban);
  const banka = iban.length === IBAN_UZUNLUGU ? bankaBul(iban) : undefined;

  const sonuc: DogrulamaSonucu = { gecerli: !hata, iban };
  if (hata) sonuc.hata = hata;
  if (banka) sonuc.banka = banka;
  else if (!hata) sonuc.uyari = `Banka kodu listede yok: ${iban.slice(4, 9)}`;
  return sonuc;
}

export function ibanGecerliMi(girdi: string): boolean {
  return typeof girdi === 'string' && ibanHatasi(ibanTemizle(girdi)) === undefined;
}
