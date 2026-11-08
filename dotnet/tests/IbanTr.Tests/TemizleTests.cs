using System.Globalization;

namespace IbanTr.Tests;

public class TemizleTests
{
    private const string Temiz = "TR330006100519786457841326";

    private static string K(int kod) => char.ConvertFromUtf32(kod);

    [Fact]
    public void BoslukTireVeOnek()
    {
        Assert.Equal(Temiz, Iban.Temizle("tr33 0006 1005 1978 6457 8413 26"));
        Assert.Equal(Temiz, Iban.Temizle("IBAN: TR33-0006-1005-1978-6457-8413-26"));
        Assert.Equal(Temiz, Iban.Temizle(" TR33" + K(0xA0) + "0006" + K(0x200B) + "1005 1978 6457 8413 26 "));
    }

    [Fact]
    public void YonIsaretleriVeTurkceOnek()
    {
        Assert.Equal(Temiz, Iban.Temizle("TR33" + K(0xAD) + "0006" + K(0x200E) + "1005 1978 6457 8413 26"));
        Assert.Equal(Temiz, Iban.Temizle(K(0x202A) + Temiz + K(0x202C)));
        Assert.Equal(Temiz, Iban.Temizle(K(0xFEFF) + Temiz));
        Assert.Equal(Temiz, Iban.Temizle("İBAN: TR33 0006 1005 1978 6457 8413 26"));
        Assert.Equal(Temiz, Iban.Temizle("IBAN No: TR33 0006 1005 1978 6457 8413 26"));
        Assert.Equal(Temiz, Iban.Temizle("IBAN Numarası: TR33 0006 1005 1978 6457 8413 26"));
        Assert.Equal(Temiz, Iban.Temizle("iban numarasi: TR33 0006 1005 1978 6457 8413 26"));
    }

    [Fact]
    public void TamGenislikliRakamlar()
    {
        // NFKC: tam genişlikli "ＴＲ３３" normal harf ve rakama döner
        var genis = string.Concat("TR330006100519786457841326".Select(c => K(c + 0xFEE0)));
        Assert.Equal(Temiz, Iban.Temizle(genis));
    }

    [Fact]
    public void GorunmeyenKarakterKoduylaGosteriliyor()
    {
        Assert.Equal("Geçersiz karakter: U+0007", Iban.Dogrula("TR33" + K(0x07) + "0006").Hata?.Mesaj);
        Assert.Equal("Geçersiz karakter: \"" + K(0x1F600) + "\"", Iban.Dogrula("TR33" + K(0x1F600) + "0006").Hata?.Mesaj);
        Assert.Equal("Geçersiz karakter: \"*\"", Iban.Dogrula("TR33*").Hata?.Mesaj);
    }

    [Fact]
    public void TurkceKulturdeDeDogruCalisiyor()
    {
        var eski = CultureInfo.CurrentCulture;
        try
        {
            CultureInfo.CurrentCulture = new CultureInfo("tr-TR");
            Assert.Equal(Temiz, Iban.Temizle("iban: tr33 0006 1005 1978 6457 8413 26"));
            Assert.Equal("33", Iban.KontrolHaneleri("tr", "0006100519786457841326"));
        }
        finally
        {
            CultureInfo.CurrentCulture = eski;
        }
    }
}
