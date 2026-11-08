namespace IbanTr.Tests;

public class BicimTests
{
    private const string IbanNo = "TR330006100519786457841326";

    [Fact]
    public void Bicimle()
    {
        Assert.Equal("TR33 0006 1005 1978 6457 8413 26", Iban.Bicimle(IbanNo));
        Assert.Equal("TR33 0006 1005 1978 6457 8413 26", Iban.Bicimle("tr33-0006-1005-1978-6457-8413-26"));
        Assert.Equal("TR33 00", Iban.Bicimle("TR3300"));
        Assert.Equal("TR33", Iban.Bicimle("TR33"));
    }

    [Fact]
    public void Maskele()
    {
        Assert.Equal("TR33 **** **** **** **** **13 26", Iban.Maskele(IbanNo));
        Assert.Equal("TR33 **** **** **** **** **** **", Iban.Maskele(IbanNo, son: 0));
        Assert.Equal("TR33••••••••••••••••••1326", Iban.Maskele(IbanNo, isaret: '•', grupla: false));
    }

    [Fact]
    public void KisaGirdi()
    {
        Assert.Equal("TR33", Iban.Maskele("TR33"));
        Assert.Equal("TR33 12", Iban.Maskele("TR3312", son: 4));
        Assert.Equal("TR", Iban.Maskele("TR"));
        Assert.Equal("", Iban.Maskele(""));
    }

    [Fact]
    public void GecersizSecenek() =>
        Assert.Throws<ArgumentOutOfRangeException>(() => Iban.Maskele(IbanNo, son: -1));
}

public class UretTests
{
    [Fact]
    public void UrettigiHerIbanGecerliVeBankasiBelli()
    {
        for (var i = 0; i < 500; i++)
        {
            var s = Iban.Dogrula(Iban.Uret());
            Assert.True(s.Gecerli, s.Iban);
            Assert.NotNull(s.Banka);
        }
    }

    [Fact]
    public void BankaVeHesapVerilebiliyor()
    {
        Assert.Equal("TR200006200000000006298765", Iban.Uret(banka: "0062", hesap: "0000000006298765"));
        Assert.Equal("00062", Iban.Uret(banka: "00062").Substring(4, 5));
    }

    [Fact]
    public void AyniTohumlaAyniSonuc() =>
        Assert.Equal(Iban.Uret(rastgele: new Random(42)), Iban.Uret(rastgele: new Random(42)));

    [Fact]
    public void HataliSecenekler()
    {
        Assert.Throws<ArgumentException>(() => Iban.Uret(banka: "9999"));
        Assert.Throws<ArgumentException>(() => Iban.Uret(banka: "0062", hesap: "123"));
        Assert.Throws<ArgumentException>(() => Iban.Uret(banka: "0062", hesap: "00000000062987６５"));
    }
}
