// src/bankalar.ts'deki listeden C# dosyasını üretir. Liste değişince çalıştır:
//   node scripts/bankalar-cs.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const ts = readFileSync(new URL('../src/bankalar.ts', import.meta.url), 'utf8');
const tarih = /LISTE_TARIHI = '([^']+)'/.exec(ts)[1];
const turler = {
  banka: 'Banka',
  katilim: 'Katilim',
  'kalkinma-yatirim': 'KalkinmaYatirim',
  'elektronik-para': 'ElektronikPara',
  diger: 'Diger',
};

const satirlar = [...ts.matchAll(/^\s*\['(\d{4})', '([^']+)', '([^']+)', '([a-z-]+)'\],$/gm)].map(
  ([, eft, ad, kisaAd, tur]) => {
    if (!turler[tur]) throw new Error(`Bilinmeyen tür: ${tur}`);
    return `        ("${eft}", ${JSON.stringify(ad)}, ${JSON.stringify(kisaAd)}, KurumTuru.${turler[tur]}),`;
  },
);
if (satirlar.length < 50) throw new Error(`Liste okunamadı, ${satirlar.length} satır`);

const cs = `// Bu dosya scripts/bankalar-cs.mjs ile src/bankalar.ts'den üretildi, elle değiştirme.

namespace IbanTr;

public static partial class Bankalar
{
    /// <summary>Listenin hazırlandığı ay.</summary>
    public const string ListeTarihi = "${tarih}";

    private static (string Eft, string Ad, string KisaAd, KurumTuru Tur)[] Satirlar() =>
    [
${satirlar.join('\n')}
    ];
}
`;

writeFileSync(new URL('../dotnet/src/IbanTr/Bankalar.Liste.cs', import.meta.url), cs);
console.log(`${satirlar.length} banka yazıldı`);
