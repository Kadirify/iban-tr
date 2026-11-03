// Kaynak: TCMB FAST katılımcı listesi ve T.C. Ticaret Bakanlığı banka listesi, Kasım 2026.
// IBAN'daki 5 haneli banka kodu = başına 0 eklenmiş 4 haneli EFT kodu.

export type KurumTuru = 'banka' | 'katilim' | 'kalkinma-yatirim' | 'elektronik-para' | 'diger';

export interface Banka {
  /** IBAN'daki 5 haneli kod: '00062' */
  kod: string;
  /** EFT kodu: '0062' */
  eftKodu: string;
  ad: string;
  kisaAd: string;
  tur: KurumTuru;
}

export const LISTE_TARIHI = '2026-11';

type Satir = [eft: string, ad: string, kisaAd: string, tur: KurumTuru];

const SATIRLAR: Satir[] = [
  ['0001', 'Türkiye Cumhuriyet Merkez Bankası', 'Merkez Bankası', 'diger'],
  ['0004', 'İller Bankası A.Ş.', 'İller Bankası', 'kalkinma-yatirim'],
  ['0010', 'Türkiye Cumhuriyeti Ziraat Bankası A.Ş.', 'Ziraat Bankası', 'banka'],
  ['0012', 'Türkiye Halk Bankası A.Ş.', 'Halkbank', 'banka'],
  ['0014', 'Türkiye Sınai Kalkınma Bankası A.Ş.', 'TSKB', 'kalkinma-yatirim'],
  ['0015', 'Türkiye Vakıflar Bankası T.A.O.', 'VakıfBank', 'banka'],
  ['0016', 'Türk Eximbank', 'Türk Eximbank', 'kalkinma-yatirim'],
  ['0017', 'Türkiye Kalkınma ve Yatırım Bankası A.Ş.', 'Kalkınma Yatırım Bankası', 'kalkinma-yatirim'],
  ['0029', 'Birleşik Fon Bankası A.Ş.', 'Birleşik Fon Bankası', 'banka'],
  ['0032', 'Türk Ekonomi Bankası A.Ş.', 'TEB', 'banka'],
  ['0046', 'Akbank T.A.Ş.', 'Akbank', 'banka'],
  ['0059', 'Şekerbank T.A.Ş.', 'Şekerbank', 'banka'],
  ['0060', 'Türk Ticaret Bankası A.Ş.', 'Türk Ticaret Bankası', 'banka'],
  ['0062', 'Türkiye Garanti Bankası A.Ş.', 'Garanti BBVA', 'banka'],
  ['0064', 'Türkiye İş Bankası A.Ş.', 'İş Bankası', 'banka'],
  ['0067', 'Yapı ve Kredi Bankası A.Ş.', 'Yapı Kredi', 'banka'],
  ['0091', 'Arap Türk Bankası A.Ş.', 'Arap Türk Bankası', 'banka'],
  ['0092', 'Citibank A.Ş.', 'Citibank', 'banka'],
  ['0094', 'Bank Mellat', 'Bank Mellat', 'banka'],
  ['0096', 'Turkish Bank A.Ş.', 'Turkish Bank', 'banka'],
  ['0097', 'Habib Bank Limited', 'Habib Bank', 'banka'],
  ['0098', 'JPMorgan Chase Bank N.A.', 'JPMorgan', 'banka'],
  ['0099', 'ING Bank A.Ş.', 'ING', 'banka'],
  ['0103', 'Fibabanka A.Ş.', 'Fibabanka', 'banka'],
  ['0108', 'Turkland Bank A.Ş.', 'Turkland Bank', 'banka'],
  ['0109', 'ICBC Turkey Bank A.Ş.', 'ICBC Turkey', 'banka'],
  ['0111', 'QNB Bank A.Ş.', 'QNB', 'banka'],
  ['0115', 'Deutsche Bank A.Ş.', 'Deutsche Bank', 'banka'],
  ['0116', 'Pasha Yatırım Bankası A.Ş.', 'Pasha Yatırım Bankası', 'kalkinma-yatirim'],
  ['0121', 'Standard Chartered Yatırım Bankası Türk A.Ş.', 'Standard Chartered', 'kalkinma-yatirim'],
  ['0122', 'Société Générale (SA)', 'Société Générale', 'banka'],
  ['0123', 'HSBC Bank A.Ş.', 'HSBC', 'banka'],
  ['0124', 'Alternatifbank A.Ş.', 'Alternatif Bank', 'banka'],
  ['0125', 'Burgan Bank A.Ş.', 'Burgan Bank', 'banka'],
  ['0129', 'Bank of America Yatırım Bank A.Ş.', 'Bank of America', 'kalkinma-yatirim'],
  ['0132', 'İstanbul Takas ve Saklama Bankası A.Ş.', 'Takasbank', 'kalkinma-yatirim'],
  ['0134', 'Denizbank A.Ş.', 'DenizBank', 'banka'],
  ['0135', 'Anadolubank A.Ş.', 'Anadolubank', 'banka'],
  ['0137', 'Rabobank A.Ş.', 'Rabobank', 'banka'],
  ['0138', 'Diler Yatırım Bankası A.Ş.', 'Diler Yatırım Bankası', 'kalkinma-yatirim'],
  ['0139', 'GSD Yatırım Bankası A.Ş.', 'GSD Yatırım Bankası', 'kalkinma-yatirim'],
  ['0141', 'Nurol Yatırım Bankası A.Ş.', 'Nurol Yatırım Bankası', 'kalkinma-yatirim'],
  ['0142', 'BankPozitif Kredi ve Kalkınma Bankası A.Ş.', 'BankPozitif', 'kalkinma-yatirim'],
  ['0143', 'Aktif Yatırım Bankası A.Ş.', 'Aktif Bank', 'kalkinma-yatirim'],
  ['0146', 'Odea Bank A.Ş.', 'Odeabank', 'banka'],
  ['0147', 'MUFG Bank Turkey A.Ş.', 'MUFG', 'banka'],
  ['0148', 'Intesa Sanpaolo S.p.A.', 'Intesa Sanpaolo', 'banka'],
  ['0149', 'Bank of China Turkey A.Ş.', 'Bank of China', 'banka'],
  ['0150', 'Golden Global Yatırım Bankası A.Ş.', 'Golden Global Yatırım Bankası', 'kalkinma-yatirim'],
  ['0151', 'D Yatırım Bankası A.Ş.', 'D Yatırım Bankası', 'kalkinma-yatirim'],
  ['0152', 'Destek Yatırım Bankası A.Ş.', 'Destek Yatırım Bankası', 'kalkinma-yatirim'],
  ['0153', 'Misyon Yatırım Bankası A.Ş.', 'Misyon Yatırım Bankası', 'kalkinma-yatirim'],
  ['0154', 'Tera Yatırım Bankası A.Ş.', 'Tera Yatırım Bankası', 'kalkinma-yatirim'],
  ['0155', 'Q Yatırım Bankası A.Ş.', 'Q Yatırım Bankası', 'kalkinma-yatirim'],
  ['0156', 'Hedef Yatırım Bankası A.Ş.', 'Hedef Yatırım Bankası', 'kalkinma-yatirim'],
  ['0157', 'Enpara Bank A.Ş.', 'Enpara', 'banka'],
  ['0158', 'Colendi Bank A.Ş.', 'Colendi', 'banka'],
  ['0159', 'Fups Bank A.Ş.', 'Fups Bank', 'banka'],
  ['0160', 'Ziraat Dinamik Banka A.Ş.', 'Ziraat Dinamik', 'banka'],
  ['0161', 'Aytemiz Yatırım Bankası A.Ş.', 'Aytemiz Yatırım Bankası', 'kalkinma-yatirim'],
  ['0203', 'Albaraka Türk Katılım Bankası A.Ş.', 'Albaraka', 'katilim'],
  ['0205', 'Kuveyt Türk Katılım Bankası A.Ş.', 'Kuveyt Türk', 'katilim'],
  ['0206', 'Türkiye Finans Katılım Bankası A.Ş.', 'Türkiye Finans', 'katilim'],
  ['0209', 'Ziraat Katılım Bankası A.Ş.', 'Ziraat Katılım', 'katilim'],
  ['0210', 'Vakıf Katılım Bankası A.Ş.', 'Vakıf Katılım', 'katilim'],
  ['0211', 'Türkiye Emlak Katılım Bankası A.Ş.', 'Emlak Katılım', 'katilim'],
  ['0212', 'Hayat Finans Katılım Bankası A.Ş.', 'Hayat Finans', 'katilim'],
  ['0213', 'T.O.M. Katılım Bankası A.Ş.', 'T.O.M. Katılım', 'katilim'],
  ['0214', 'Dünya Katılım Bankası A.Ş.', 'Dünya Katılım', 'katilim'],
  ['0806', 'Merkezi Kayıt Kuruluşu A.Ş.', 'MKK', 'diger'],
  ['0807', 'Posta ve Telgraf Teşkilatı A.Ş.', 'PTT', 'diger'],
  ['0825', 'Moka United Ödeme Hizmetleri ve Elektronik Para Kuruluşu A.Ş.', 'Moka United', 'elektronik-para'],
  ['0827', 'Turk Elektronik Para A.Ş.', 'Turk Elektronik Para', 'elektronik-para'],
  ['0828', 'Belbim Elektronik Para ve Ödeme Hizmetleri A.Ş.', 'Belbim', 'elektronik-para'],
  ['0829', 'Papara Elektronik Para A.Ş.', 'Papara', 'elektronik-para'],
  ['0838', 'Sipay Elektronik Para ve Ödeme Hizmetleri A.Ş.', 'Sipay', 'elektronik-para'],
  ['0850', 'BPN Ödeme ve Elektronik Para Hizmetleri A.Ş.', 'BPN', 'elektronik-para'],
  ['0864', 'İyzi Ödeme ve Elektronik Para Hizmetleri A.Ş.', 'iyzico', 'elektronik-para'],
  ['0869', 'Turkcell Ödeme ve Elektronik Para Hizmetleri A.Ş.', 'Paycell', 'elektronik-para'],
  ['0890', 'Lydians Elektronik Para ve Ödeme Hizmetleri A.Ş.', 'Lydians', 'elektronik-para'],
  ['0894', 'Ahlatcı Ödeme ve Elektronik Para Hizmetleri A.Ş.', 'Ahlatcı Ödeme', 'elektronik-para'],
  ['0911', 'AS Ödeme Hizmetleri ve Elektronik Para A.Ş.', 'AS Ödeme', 'elektronik-para'],
];

export const BANKALAR: readonly Banka[] = Object.freeze(
  SATIRLAR.map(([eftKodu, ad, kisaAd, tur]) => Object.freeze({ kod: `0${eftKodu}`, eftKodu, ad, kisaAd, tur })),
);

const KODA_GORE = new Map(BANKALAR.map((b) => [b.kod, b]));

/**
 * IBAN'dan ya da banka kodundan bankayı bulur. Listede yoksa undefined.
 *
 * bankaBul('TR33 0006 2...')  // Garanti BBVA
 * bankaBul('0062')            // aynı
 */
export function bankaBul(ibanVeyaKod: string): Banka | undefined {
  const s = String(ibanVeyaKod).replace(/[\s\-.]/g, '').toUpperCase();
  if (/^\d{4}$/.test(s)) return KODA_GORE.get(`0${s}`);
  if (/^\d{5}$/.test(s)) return KODA_GORE.get(s);
  if (/^TR\d{7}/.test(s)) return KODA_GORE.get(s.slice(4, 9));
  return undefined;
}
