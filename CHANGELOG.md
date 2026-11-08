# Değişiklikler

## 1.0.2

- "IBAN Numarası:" öneki temizlenmiyordu.

## 1.0.1

- Kontrol hanesi 00, 01 ya da 99 olan IBAN'lar geçerli sayılıyordu.
- Yumuşak tire, yön işaretleri ve Türkçe klavyeyle yazılmış "İBAN:" öneki temizlenmiyordu.
- Görünmeyen bir karakter yüzünden geçersizse mesajda karakterin kodu yazıyor.
- `ibanUret` rastgele kaynak 1 döndüğünde çöküyordu.
- `ibanMaskele` tek karakterden uzun işareti, `kontrolHaneleri` küçük harfi kabul ediyordu.

## 1.0.0

İlk sürüm.
