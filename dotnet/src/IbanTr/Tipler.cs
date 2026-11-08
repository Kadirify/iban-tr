namespace IbanTr;

/// <summary>IBAN neden geçersiz.</summary>
public enum HataKodu
{
    /// <summary>Girdi boş.</summary>
    Bos,
    /// <summary>Harf ya da rakam olmayan karakter, ya da TR'den sonra harf var.</summary>
    Karakter,
    /// <summary>TR ile başlamıyor.</summary>
    Ulke,
    /// <summary>26 karakter değil.</summary>
    Uzunluk,
    /// <summary>10. karakter 0 değil.</summary>
    Rezerv,
    /// <summary>Kontrol haneleri tutmuyor.</summary>
    Kontrol,
}

/// <summary>Hata kodu ve kullanıcıya gösterilebilecek Türkçe mesaj.</summary>
public sealed record IbanHatasi(HataKodu Kod, string Mesaj);

/// <summary><see cref="Iban.Dogrula"/> sonucu.</summary>
/// <param name="Gecerli">IBAN geçerli mi.</param>
/// <param name="Iban">Temizlenmiş hali: TR330006100519786457841326</param>
/// <param name="Hata">Geçersizse nedeni.</param>
/// <param name="Banka">Banka kodu listede varsa. IBAN geçersiz ama uzunluğu doğruysa da dolu gelir.</param>
/// <param name="Uyari">Geçerli ama banka kodu listede yok. Yeni kurulan bir banka olabilir.</param>
public sealed record DogrulamaSonucu(bool Gecerli, string Iban, IbanHatasi? Hata, Banka? Banka, string? Uyari);

/// <summary>IBAN'ın parçaları.</summary>
public sealed record IbanParcalari(string Ulke, string Kontrol, string BankaKodu, string Rezerv, string Hesap);

/// <summary>Kurumun türü.</summary>
public enum KurumTuru
{
    /// <summary>Mevduat bankası.</summary>
    Banka,
    /// <summary>Katılım bankası.</summary>
    Katilim,
    /// <summary>Kalkınma ve yatırım bankası.</summary>
    KalkinmaYatirim,
    /// <summary>Elektronik para ve ödeme kuruluşu.</summary>
    ElektronikPara,
    /// <summary>Merkez Bankası, PTT, MKK gibi.</summary>
    Diger,
}

/// <summary>Banka ya da ödeme kuruluşu.</summary>
/// <param name="Kod">IBAN'daki 5 haneli kod: 00062</param>
/// <param name="EftKodu">EFT kodu: 0062</param>
/// <param name="Ad">Unvanı.</param>
/// <param name="KisaAd">Bilinen adı: Garanti BBVA</param>
/// <param name="Tur">Kurumun türü.</param>
public sealed record Banka(string Kod, string EftKodu, string Ad, string KisaAd, KurumTuru Tur);
