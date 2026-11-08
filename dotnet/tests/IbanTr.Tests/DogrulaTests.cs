namespace IbanTr.Tests;

public class DogrulaTests
{
    // JS testlerindeki IBAN'larla aynı
    private static readonly string[] GecerliIbanlar =
    [
        "TR330006100519786457841326",
        "TR680001000000123456789012",
        "TR670004600000000000012345",
        "TR200006200000000006298765",
        "TR190082900000000000000042",
    ];

    public static TheoryData<string> Gecerli => new(GecerliIbanlar);

    [Theory]
    [MemberData(nameof(Gecerli))]
    public void GecerliIban(string iban)
    {
        var s = Iban.Dogrula(iban);
        Assert.True(s.Gecerli);
        Assert.Equal(iban, s.Iban);
        Assert.Null(s.Hata);
        Assert.True(Iban.GecerliMi(iban));
    }

    [Fact]
    public void BicimliYazim() => Assert.True(Iban.GecerliMi("TR33 0006 1005 1978 6457 8413 26"));

    [Theory]
    [InlineData("", HataKodu.Bos)]
    [InlineData("TR33 0006 1005 1978 6457 8413 2*", HataKodu.Karakter)]
    [InlineData("DE89370400440532013000", HataKodu.Ulke)]
    [InlineData("330006100519786457841326", HataKodu.Ulke)]
    [InlineData("TR33000610051978645784132", HataKodu.Uzunluk)]
    [InlineData("TR3300061005197864578413266", HataKodu.Uzunluk)]
    [InlineData("TR330006110519786457841326", HataKodu.Rezerv)]
    [InlineData("TR330006100519786457841327", HataKodu.Kontrol)]
    [InlineData("TR33O006100519786457841326", HataKodu.Karakter)]
    public void HataKodlari(string iban, HataKodu kod)
    {
        var s = Iban.Dogrula(iban);
        Assert.False(s.Gecerli);
        Assert.Equal(kod, s.Hata?.Kod);
    }

    [Fact]
    public void HataMesajlari()
    {
        Assert.Equal("26 karakter olmalı, 25 var", Iban.Dogrula("TR33000610051978645784132").Hata?.Mesaj);
        Assert.Equal("\"O\" harfi var, sıfır olmalı", Iban.Dogrula("TR33O006100519786457841326").Hata?.Mesaj);
        Assert.Equal("\"I\" harfi var, bir olmalı", Iban.Dogrula("TR33I006100519786457841326").Hata?.Mesaj);
        Assert.Equal("Türk IBAN'ı değil, DE ile başlıyor", Iban.Dogrula("DE89370400440532013000").Hata?.Mesaj);
        Assert.Equal("TR ile başlamalı", Iban.Dogrula("T").Hata?.Mesaj);
    }

    [Fact]
    public void YerDegistirmeyiYakaliyor()
    {
        const string iban = "TR330006100519786457841326";
        for (var i = 4; i < iban.Length - 1; i++)
        {
            if (iban[i] == iban[i + 1]) continue;
            var bozuk = iban[..i] + iban[i + 1] + iban[i] + iban[(i + 2)..];
            Assert.False(Iban.GecerliMi(bozuk), bozuk);
        }
    }

    [Fact]
    public void TekRakamHatasiniYakaliyor()
    {
        const string iban = "TR680001000000123456789012";
        for (var i = 4; i < iban.Length; i++)
        {
            for (var r = '0'; r <= '9'; r++)
            {
                if (r == iban[i]) continue;
                var bozuk = iban[..i] + r + iban[(i + 1)..];
                Assert.False(Iban.GecerliMi(bozuk), bozuk);
            }
        }
    }

    [Fact]
    public void KontrolHanesi00Ve99Gecersiz()
    {
        // mod 97 tutsa bile: 99 = 02, 00 = 97 (mod 97)
        Assert.False(Iban.GecerliMi("TR990001001777740266462208"));
        Assert.False(Iban.GecerliMi("TR000003205032477938551550"));
        Assert.Equal(HataKodu.Kontrol, Iban.Dogrula("TR990001001777740266462208").Hata?.Kod);
    }

    [Fact]
    public void Null()
    {
        Assert.False(Iban.GecerliMi(null));
        Assert.Throws<ArgumentNullException>(() => Iban.Dogrula(null!));
    }

    [Fact]
    public void Mod97VeKontrolHaneleri()
    {
        Assert.Equal(1, Iban.Mod97("0006100519786457841326TR33"));
        foreach (var iban in GecerliIbanlar)
            Assert.Equal(iban[2..4], Iban.KontrolHaneleri("TR", iban[4..]));
        Assert.Equal("33", Iban.KontrolHaneleri("tr", "0006100519786457841326"));
        Assert.Throws<ArgumentException>(() => Iban.KontrolHaneleri("TR", "00-06"));
        Assert.Throws<ArgumentException>(() => Iban.KontrolHaneleri("T", "0006"));
    }

    [Fact]
    public void Parcala()
    {
        Assert.Equal(
            new IbanParcalari("TR", "33", "00061", "0", "0519786457841326"),
            Iban.Parcala("TR33 0006 1005 1978 6457 8413 26"));
        Assert.Equal(new IbanParcalari("TR", "3", "", "", ""), Iban.Parcala("TR3"));
    }
}
