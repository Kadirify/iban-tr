# IbanTr

Türk IBAN'larını doğrular, hangi bankanın olduğunu bulur, biçimler ve maskeler.
Geçersizse nedenini söyler. Hesabın açık olup olmadığını ya da kime ait olduğunu söyleyemez,
onu sadece banka bilir.

[iban-tr](https://www.npmjs.com/package/iban-tr) npm paketinin C# sürümü, aynı kurallar ve aynı
banka listesi. NuGet'te yok, projeye referans olarak eklenerek kullanılıyor:

```
dotnet add reference ../iban-tr/dotnet/src/IbanTr/IbanTr.csproj
```

.NET 8 ve üstü, .NET Framework 4.6.2 ve üstü (netstandard2.0). Bağımlılığı yok.

## Doğrulama

```csharp
using IbanTr;

var s = Iban.Dogrula("TR20 0006 2000 0000 0006 2987 65");
s.Gecerli;        // true
s.Iban;           // "TR200006200000000006298765"
s.Banka?.KisaAd;  // "Garanti BBVA"

var hata = Iban.Dogrula("TR21 0006 2000 0000 0006 2987 65").Hata;
hata?.Kod;    // HataKodu.Kontrol
hata?.Mesaj;  // "Kontrol hanesi tutmuyor, bir rakam yanlış yazılmış olabilir"

Iban.GecerliMi("TR20 0006 2000 0000 0006 2987 65");  // true
```

Boşluklar, tireler, baştaki "IBAN:" yazısı ve kopyalarken gelen görünmez karakterler
temizleniyor. `Hata.Kod` şunlardan biri: `Bos`, `Karakter`, `Ulke`, `Uzunluk`, `Rezerv`, `Kontrol`.
`Hata.Mesaj` kullanıcıya olduğu gibi gösterilebilir, örneğin "26 karakter olmalı, 25 var".

Banka kodu listede olmayan bir IBAN geçersiz sayılmıyor, `Uyari` doluyor.

## Banka

```csharp
Bankalar.Bul("TR20 0006 2000 0000 0006 2987 65")?.KisaAd;  // "Garanti BBVA"
Bankalar.Bul("0046")?.KisaAd;                              // "Akbank"
Bankalar.Liste;                                            // hepsi
```

Liste TCMB'nin FAST katılımcı listesinden ve Ticaret Bakanlığı'nın banka listesinden.

## Biçim, maske, test IBAN'ı

```csharp
Iban.Bicimle("tr200006200000000006298765");  // "TR20 0006 2000 0000 0006 2987 65"
Iban.Maskele("TR200006200000000006298765");  // "TR20 **** **** **** **** **87 65"
Iban.Maskele(iban, son: 6, isaret: '•');
Iban.Parcala(iban);                          // Ulke, Kontrol, BankaKodu, Rezerv, Hesap

Iban.Uret();                                 // rastgele bir bankadan
Iban.Uret(banka: "0046");
Iban.Uret(rastgele: new Random(42));         // her seferinde aynı
```

Üretilen IBAN'lar gerçek bir hesaba karşılık gelmiyor, test verisi için.

## Lisans

MIT
