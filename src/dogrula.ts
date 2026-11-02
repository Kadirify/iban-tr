import { ibanHatasi, ibanTemizle, type IbanHatasi } from './iban';

export interface DogrulamaSonucu {
  gecerli: boolean;
  /** Temizlenmiş hali: TR330006100519786457841326 */
  iban: string;
  hata?: IbanHatasi;
}

export function ibanDogrula(girdi: string): DogrulamaSonucu {
  const iban = ibanTemizle(girdi);
  const hata = ibanHatasi(iban);
  return hata ? { gecerli: false, iban, hata } : { gecerli: true, iban };
}

export function ibanGecerliMi(girdi: string): boolean {
  return typeof girdi === 'string' && ibanHatasi(ibanTemizle(girdi)) === undefined;
}
