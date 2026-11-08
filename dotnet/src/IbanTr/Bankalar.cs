using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;

namespace IbanTr;

/// <summary>Bankalar, katılım bankaları ve elektronik para kuruluşları.</summary>
public static partial class Bankalar
{
    private static readonly Banka[] Dizi = Satirlar()
        .Select(s => new Banka("0" + s.Eft, s.Eft, s.Ad, s.KisaAd, s.Tur))
        .ToArray();

    private static readonly Dictionary<string, Banka> KodaGore = Dizi.ToDictionary(b => b.Kod, StringComparer.Ordinal);

    internal static readonly Banka[] Uretilebilir = Dizi
        .Where(b => b.Tur is KurumTuru.Banka or KurumTuru.Katilim)
        .ToArray();

    /// <summary>Tüm liste, EFT koduna göre sıralı.</summary>
    public static IReadOnlyList<Banka> Liste { get; } = new ReadOnlyCollection<Banka>(Dizi);

    /// <summary>IBAN'dan, 4 haneli EFT kodundan ya da 5 haneli banka kodundan bankayı bulur. Listede yoksa null.</summary>
    public static Banka? Bul(string? ibanVeyaKod)
    {
        if (ibanVeyaKod is null) return null;
        var sb = new StringBuilder(ibanVeyaKod.Length);
        foreach (var c in ibanVeyaKod)
            if (!char.IsWhiteSpace(c) && c != '-' && c != '.') sb.Append(c);
        var s = sb.ToString().ToUpperInvariant();

        string? kod = null;
        if (s.Length == 4 && Rakam(s, 0, 4)) kod = "0" + s;
        else if (s.Length == 5 && Rakam(s, 0, 5)) kod = s;
        else if (s.Length >= 9 && s.StartsWith("TR", StringComparison.Ordinal) && Rakam(s, 2, 7)) kod = s.Substring(4, 5);

        return kod is not null && KodaGore.TryGetValue(kod, out var b) ? b : null;
    }

    private static bool Rakam(string s, int bas, int adet)
    {
        for (var i = bas; i < bas + adet; i++)
            if (s[i] < '0' || s[i] > '9') return false;
        return true;
    }
}
