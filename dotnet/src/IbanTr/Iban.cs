using System;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace IbanTr;

/// <summary>Türk IBAN'ı için doğrulama, biçimleme, maskeleme ve test IBAN'ı üretme.</summary>
public static class Iban
{
    /// <summary>Türk IBAN'ının karakter sayısı.</summary>
    public const int Uzunluk = 26;

    private static readonly Regex Onek = new("^[İI]BAN(NO|NUMARASI)?:?", RegexOptions.CultureInvariant);

    /// <summary>Boşlukları, tireleri, baştaki "IBAN:" yazısını ve görünmez karakterleri atar, büyük harfe çevirir.</summary>
    public static string Temizle(string girdi)
    {
        if (girdi is null) throw new ArgumentNullException(nameof(girdi));
        var sb = new StringBuilder(girdi.Length);
        foreach (var c in Normallestir(girdi))
        {
            if (!Atilacak(c)) sb.Append(c);
        }
        // ToUpperInvariant ı'yı I yapmıyor
        return Onek.Replace(sb.ToString().ToUpperInvariant().Replace('ı', 'I'), "");
    }

    // Normalize yarım kalmış emojide (eşi olmayan surrogate) hata fırlatıyor; IBAN zaten geçersiz
    private static string Normallestir(string s)
    {
        try { return s.Normalize(NormalizationForm.FormKC); }
        catch (ArgumentException) { return s; }
    }

    // JS'teki \s ile aynı: char.IsWhiteSpace U+0085'i de sayıyor
    internal static bool Bosluk(char c) => char.IsWhiteSpace(c) && c != (char)0x0085;

    // Kopyalarken gelen görünmez karakterler: yumuşak tire, sıfır genişlikli boşluk, yön işaretleri
    private static bool Atilacak(char c) =>
        Bosluk(c)
        || c is '.' or '-' or '_' or '/'
        || c == (char)0x00AD
        || (c >= (char)0x200B && c <= (char)0x200F)
        || (c >= (char)0x202A && c <= (char)0x202E)
        || (c >= (char)0x2060 && c <= (char)0x2069)
        || c == (char)0xFEFF;

    /// <summary>IBAN'ı doğrular. Geçersizse <see cref="DogrulamaSonucu.Hata"/> nedenini söyler.</summary>
    public static DogrulamaSonucu Dogrula(string girdi)
    {
        var iban = Temizle(girdi);
        var hata = Hatasi(iban);
        var banka = iban.Length == Uzunluk ? Bankalar.Bul(iban) : null;
        string? uyari = banka is null && hata is null ? $"Banka kodu listede yok: {iban.Substring(4, 5)}" : null;
        return new DogrulamaSonucu(hata is null, iban, hata, banka, uyari);
    }

    /// <summary>Sadece evet/hayır. null için false.</summary>
    public static bool GecerliMi(string? girdi) => girdi is not null && Hatasi(Temizle(girdi)) is null;

    internal static IbanHatasi? Hatasi(string iban)
    {
        if (iban.Length == 0) return new(HataKodu.Bos, "IBAN boş");

        for (var i = 0; i < iban.Length; i++)
        {
            var c = iban[i];
            if ((c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')) continue;
            return new(HataKodu.Karakter, $"Geçersiz karakter: {Goster(iban, i)}");
        }

        if (!char.IsLetter(iban[0]) || iban.Length < 2 || !char.IsLetter(iban[1]))
            return new(HataKodu.Ulke, "TR ile başlamalı");
        if (!iban.StartsWith("TR", StringComparison.Ordinal))
            return new(HataKodu.Ulke, $"Türk IBAN'ı değil, {iban.Substring(0, 2)} ile başlıyor");

        for (var i = 2; i < iban.Length; i++)
        {
            var h = iban[i];
            if (h < 'A' || h > 'Z') continue;
            var oneri = h == 'O' ? ", sıfır olmalı" : h is 'I' or 'L' ? ", bir olmalı" : "";
            return new(HataKodu.Karakter, $"\"{h}\" harfi var{oneri}");
        }

        if (iban.Length != Uzunluk)
            return new(HataKodu.Uzunluk, $"{Uzunluk} karakter olmalı, {iban.Length} var");
        if (iban[9] != '0') return new(HataKodu.Rezerv, "10. karakter 0 olmalı");

        var kk = (iban[2] - '0') * 10 + (iban[3] - '0');
        if (kk < 2 || kk > 98) return new(HataKodu.Kontrol, "Kontrol haneleri 02 ile 98 arasında olmalı");
        if (Mod97(iban.Substring(4) + iban.Substring(0, 4)) != 1)
            return new(HataKodu.Kontrol, "Kontrol hanesi tutmuyor, bir rakam yanlış yazılmış olabilir");
        return null;
    }

    // görünmeyen karakteri kodu ile göster, yoksa mesajda boş tırnak çıkıyor
    private static string Goster(string s, int i)
    {
        var uzunluk = char.IsSurrogatePair(s, i) ? 2 : 1;
        var kategori = CharUnicodeInfo.GetUnicodeCategory(s, i);
        var gorunur = kategori switch
        {
            UnicodeCategory.Control or UnicodeCategory.Format or UnicodeCategory.Surrogate
                or UnicodeCategory.PrivateUse or UnicodeCategory.OtherNotAssigned
                or UnicodeCategory.SpaceSeparator or UnicodeCategory.LineSeparator
                or UnicodeCategory.ParagraphSeparator or UnicodeCategory.NonSpacingMark
                or UnicodeCategory.SpacingCombiningMark or UnicodeCategory.EnclosingMark => false,
            _ => true,
        };
        if (gorunur) return $"\"{s.Substring(i, uzunluk)}\"";
        var kod = uzunluk == 2 ? char.ConvertToUtf32(s, i) : s[i];
        return $"U+{kod:X4}";
    }

    internal static int Mod97(string metin)
    {
        var kalan = 0;
        foreach (var h in metin)
        {
            kalan = h >= 'A' && h <= 'Z'
                ? (kalan * 100 + (h - 55)) % 97
                : (kalan * 10 + (h - '0')) % 97;
        }
        return kalan;
    }

    /// <summary>Ülke kodu ve BBAN için iki haneli kontrol numarası.</summary>
    /// <exception cref="ArgumentException">Ülke kodu iki harf ya da BBAN harf/rakam değilse.</exception>
    public static string KontrolHaneleri(string ulke, string bban)
    {
        ulke = (ulke ?? "").ToUpperInvariant();
        bban = (bban ?? "").ToUpperInvariant();
        if (ulke.Length != 2 || !HarfMi(ulke[0]) || !HarfMi(ulke[1]) || bban.Length == 0 || !HarfRakam(bban))
            throw new ArgumentException($"Geçersiz ülke kodu ya da BBAN: {ulke} {bban}");
        var k = 98 - Mod97(bban + ulke + "00");
        return k.ToString("00", CultureInfo.InvariantCulture);
    }

    private static bool HarfMi(char c) => c >= 'A' && c <= 'Z';

    private static bool HarfRakam(string s)
    {
        foreach (var c in s)
            if (!HarfMi(c) && (c < '0' || c > '9')) return false;
        return true;
    }

    /// <summary>TR33 00061 0 0519786457841326 gibi parçalara ayırır. Geçerlilik kontrol etmez.</summary>
    public static IbanParcalari Parcala(string girdi)
    {
        var iban = Temizle(girdi);
        return new IbanParcalari(
            Kes(iban, 0, 2), Kes(iban, 2, 4), Kes(iban, 4, 9), Kes(iban, 9, 10), Kes(iban, 10, iban.Length));
    }

    private static string Kes(string s, int bas, int son)
    {
        bas = Math.Min(bas, s.Length);
        son = Math.Min(son, s.Length);
        return s.Substring(bas, Math.Max(son - bas, 0));
    }

    /// <summary>4'erli gruplar: TR33 0006 1005 1978 6457 8413 26</summary>
    public static string Bicimle(string girdi) => Grupla(Temizle(girdi));

    /// <summary>Ülke kodu, kontrol haneleri ve son karakterler dışını gizler: TR33 **** **** **** **** **13 26</summary>
    /// <param name="girdi">IBAN</param>
    /// <param name="son">Sonda açık kalacak karakter sayısı.</param>
    /// <param name="isaret">Gizlenen yerlere yazılacak karakter.</param>
    /// <param name="grupla">4'erli gruplansın mı.</param>
    public static string Maskele(string girdi, int son = 4, char isaret = '*', bool grupla = true)
    {
        if (son < 0) throw new ArgumentOutOfRangeException(nameof(son), son, "son 0 ya da pozitif olmalı");
        var iban = Temizle(girdi);
        var acikSon = Math.Min(son, Math.Max(iban.Length - 4, 0));
        var gizli = Math.Max(iban.Length - 4 - acikSon, 0);
        var maskeli = Kes(iban, 0, 4) + new string(isaret, gizli) + iban.Substring(iban.Length - acikSon);
        return grupla ? Grupla(maskeli) : maskeli;
    }

    private static string Grupla(string s)
    {
        var sb = new StringBuilder(s.Length + s.Length / 4);
        for (var i = 0; i < s.Length; i++)
        {
            if (i > 0 && i % 4 == 0) sb.Append(' ');
            sb.Append(s[i]);
        }
        return sb.ToString();
    }

    /// <summary>Kontrol hanesi doğru, test için IBAN üretir. Gerçek bir hesaba karşılık gelmez.</summary>
    /// <param name="banka">EFT ya da IBAN banka kodu: "0062", "00062". Verilmezse listeden rastgele bir banka.</param>
    /// <param name="hesap">16 rakamlı hesap kısmı. Verilmezse rastgele.</param>
    /// <param name="rastgele">Aynı sonucu almak için tohumlu bir <see cref="Random"/>.</param>
    public static string Uret(string? banka = null, string? hesap = null, Random? rastgele = null)
    {
        string kod;
        if (banka is not null)
        {
            kod = Bankalar.Bul(banka)?.Kod ?? throw new ArgumentException($"Bilinmeyen banka kodu: {banka}", nameof(banka));
        }
        else
        {
            var adaylar = Bankalar.Uretilebilir;
            kod = adaylar[Sayi(rastgele, adaylar.Length)].Kod;
        }

        if (hesap is null)
        {
            var sb = new StringBuilder(16);
            for (var i = 0; i < 16; i++) sb.Append((char)('0' + Sayi(rastgele, 10)));
            hesap = sb.ToString();
        }
        else if (hesap.Length != 16 || !TumuRakam(hesap))
        {
            throw new ArgumentException($"Hesap kısmı 16 rakam olmalı: {hesap}", nameof(hesap));
        }

        var bban = kod + "0" + hesap;
        return "TR" + KontrolHaneleri("TR", bban) + bban;
    }

    private static bool TumuRakam(string s)
    {
        foreach (var c in s)
            if (c < '0' || c > '9') return false;
        return true;
    }

#if NET6_0_OR_GREATER
    private static int Sayi(Random? r, int ust) => (r ?? Random.Shared).Next(ust);
#else
    private static readonly Random Ortak = new();

    private static int Sayi(Random? r, int ust)
    {
        if (r is not null) return r.Next(ust);
        lock (Ortak) return Ortak.Next(ust);
    }
#endif
}
