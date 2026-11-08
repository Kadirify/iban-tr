# iban-tr

[![CI](https://github.com/Kadirify/iban-tr/actions/workflows/ci.yml/badge.svg)](https://github.com/Kadirify/iban-tr/actions/workflows/ci.yml)

Türk IBAN'larını doğrular, hangi bankanın olduğunu bulur, biçimler ve maskeler.
Geçersizse nedenini söyler. Hesabın açık olup olmadığını ya da kime ait olduğunu söyleyemez,
onu sadece banka bilir.

```js
import { ibanDogrula } from 'iban-tr';

ibanDogrula('TR20 0006 2000 0000 0006 2987 65');
// {
//   gecerli: true,
//   iban: 'TR200006200000000006298765',
//   banka: { kod: '00062', eftKodu: '0062', ad: 'Türkiye Garanti Bankası A.Ş.', kisaAd: 'Garanti BBVA', tur: 'banka' }
// }

ibanDogrula('TR21 0006 2000 0000 0006 2987 65').hata;
// { kod: 'kontrol', mesaj: 'Kontrol hanesi tutmuyor, bir rakam yanlış yazılmış olabilir' }
```

## Kurulum

```
npm install iban-tr
```

Bağımlılığı yok. Node 20 ve üstü, ESM ve CommonJS.

## Doğrulama

`ibanDogrula` boşlukları, tireleri, baştaki "IBAN:" yazısını ve kopyalarken gelen görünmez
karakterleri temizleyip kontrol ediyor. `hata.kod` şunlardan biri: `bos`, `karakter`, `ulke`,
`uzunluk`, `rezerv`, `kontrol`. Mesaj kullanıcıya olduğu gibi gösterilebilir, örneğin
"26 karakter olmalı, 25 var" ya da `"O" harfi var, sıfır olmalı`.

Sadece evet/hayır lazımsa `ibanGecerliMi(iban)`.

Banka kodu listede olmayan bir IBAN geçersiz sayılmıyor, `uyari` alanı doluyor. Yeni banka
kurulduğunda paket güncellenene kadar böyle kalır.

## Banka

```js
import { bankaBul, BANKALAR } from 'iban-tr';

bankaBul('TR20 0006 2000 0000 0006 2987 65').kisaAd;  // 'Garanti BBVA'
bankaBul('0046').kisaAd;                              // 'Akbank', EFT koduyla da
```

`BANKALAR` 80'den fazla kuruluşu içeriyor: bankalar, katılım bankaları, kalkınma ve yatırım bankaları,
PTT ve Papara, iyzico gibi elektronik para kuruluşları. Liste TCMB'nin FAST katılımcı listesinden
ve Ticaret Bakanlığı'nın banka listesinden, Kasım 2026.

## Biçim ve maske

```js
import { ibanBicimle, ibanMaskele, ibanParcala } from 'iban-tr';

ibanBicimle('tr200006200000000006298765');   // 'TR20 0006 2000 0000 0006 2987 65'
ibanMaskele('TR200006200000000006298765');   // 'TR20 **** **** **** **** **87 65'
ibanMaskele(iban, { son: 6, isaret: '•' });

ibanParcala('TR200006200000000006298765');
// { ulke: 'TR', kontrol: '20', bankaKodu: '00062', rezerv: '0', hesap: '0000000006298765' }
```

## Test için IBAN

```js
import { ibanUret } from 'iban-tr';

ibanUret();                    // rastgele bir bankadan
ibanUret({ banka: '0046' });   // 'TR87 0004 6085 1501 9579 7184 36' gibi
```

Üretilen IBAN'ların kontrol hanesi doğru ama gerçek bir hesaba karşılık gelmiyor. Test verisi
ve form denemeleri için.

## Kontrol sayfası ve API

Aynı repo bir web sayfası ve küçük bir API olarak da yayında. Kaynakları `public/` ve `api/`
altında, Vercel'de çalışıyor.

## Lisans

MIT
