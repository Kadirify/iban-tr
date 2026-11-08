namespace IbanTr.Tests;

public class BankaTests
{
    [Fact]
    public void KodlarBenzersizVeBesHaneli()
    {
        var kodlar = Bankalar.Liste.Select(b => b.Kod).ToList();
        Assert.Equal(kodlar.Count, kodlar.Distinct().Count());
        Assert.True(kodlar.Count > 80);
        foreach (var b in Bankalar.Liste)
        {
            Assert.Matches("^0[0-9]{4}$", b.Kod);
            Assert.Equal("0" + b.EftKodu, b.Kod);
        }
    }

    [Theory]
    [InlineData("0010", "Ziraat Bankası")]
    [InlineData("0012", "Halkbank")]
    [InlineData("0015", "VakıfBank")]
    [InlineData("0046", "Akbank")]
    [InlineData("0062", "Garanti BBVA")]
    [InlineData("0064", "İş Bankası")]
    [InlineData("0067", "Yapı Kredi")]
    [InlineData("0111", "QNB")]
    [InlineData("0134", "DenizBank")]
    [InlineData("0205", "Kuveyt Türk")]
    [InlineData("0829", "Papara")]
    public void BuyukBankalar(string eft, string kisaAd) => Assert.Equal(kisaAd, Bankalar.Bul(eft)?.KisaAd);

    [Fact]
    public void IbandanVeKoddanBuluyor()
    {
        Assert.Equal("00062", Bankalar.Bul("TR20 0006 2000 0000 0006 2987 65")?.Kod);
        Assert.Equal("00062", Bankalar.Bul("00062")?.Kod);
        Assert.Null(Bankalar.Bul("9999"));
        Assert.Null(Bankalar.Bul("Garanti"));
        Assert.Null(Bankalar.Bul(null));
    }

    [Fact]
    public void ListeDegistirilemiyor()
    {
        var liste = Assert.IsAssignableFrom<IList<Banka>>(Bankalar.Liste);
        Assert.True(liste.IsReadOnly);
        Assert.Throws<NotSupportedException>(() => liste[0] = liste[1]);
    }

    [Fact]
    public void GecerliIbanBankasiylaGeliyor() =>
        Assert.Equal("Garanti BBVA", Iban.Dogrula("TR200006200000000006298765").Banka?.KisaAd);

    [Fact]
    public void KontrolHanesiTutmasaDaBankayiSoyluyor()
    {
        var s = Iban.Dogrula("TR210006200000000006298765");
        Assert.False(s.Gecerli);
        Assert.Equal("Garanti BBVA", s.Banka?.KisaAd);
    }

    [Fact]
    public void ListedeOlmayanKodUyari()
    {
        var s = Iban.Dogrula("TR330006100519786457841326");
        Assert.True(s.Gecerli);
        Assert.Null(s.Banka);
        Assert.Equal("Banka kodu listede yok: 00061", s.Uyari);
    }

    [Fact]
    public void JsListesiyleAyni()
    {
        // C# listesi src/bankalar.ts'den üretiliyor; elle değiştirilirse burada yakalanır
        var ts = File.ReadAllText(Path.Combine(Kok(), "src", "bankalar.ts"));
        var eftler = System.Text.RegularExpressions.Regex.Matches(ts, @"^\s*\['(\d{4})'", System.Text.RegularExpressions.RegexOptions.Multiline)
            .Select(m => m.Groups[1].Value)
            .ToList();
        Assert.Equal(eftler, Bankalar.Liste.Select(b => b.EftKodu).ToList());
    }

    private static string Kok()
    {
        var d = new DirectoryInfo(AppContext.BaseDirectory);
        while (d is not null && !File.Exists(Path.Combine(d.FullName, "src", "bankalar.ts"))) d = d.Parent;
        return d?.FullName ?? throw new InvalidOperationException("Repo kökü bulunamadı");
    }
}
