import { ibanBicimle, ibanDogrula, type DogrulamaSonucu } from '../src/index';

// IBAN kişisel veri; istek ya da sonuç hiçbir yere yazılmıyor.

const BASLIKLAR = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
  'cache-control': 'no-store',
};

const EN_FAZLA = 100;

function cevap(govde: unknown, durum = 200): Response {
  return new Response(JSON.stringify(govde), { status: durum, headers: BASLIKLAR });
}

function hataCevabi(kod: string, mesaj: string, durum = 400): Response {
  return cevap({ hata: { kod, mesaj } }, durum);
}

function sonuc(girdi: unknown) {
  if (typeof girdi !== 'string') {
    return { gecerli: false, iban: '', hata: { kod: 'bos', mesaj: 'IBAN metin olmalı' } };
  }
  const s: DogrulamaSonucu = ibanDogrula(girdi);
  return {
    gecerli: s.gecerli,
    iban: s.iban,
    bicimli: ibanBicimle(s.iban),
    banka: s.banka ?? null,
    hata: s.hata ?? null,
    uyari: s.uyari ?? null,
  };
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: BASLIKLAR });
}

export function GET(istek: Request): Response {
  const iban = new URL(istek.url).searchParams.get('iban');
  if (iban === null) return hataCevabi('eksik', 'iban parametresi yok. Örnek: /api/dogrula?iban=TR33...');
  return cevap(sonuc(iban));
}

export async function POST(istek: Request): Promise<Response> {
  let govde: unknown;
  try {
    govde = await istek.json();
  } catch {
    return hataCevabi('json', 'Gövde JSON değil');
  }
  if (govde && typeof govde === 'object' && 'ibanlar' in govde) {
    const liste = (govde as { ibanlar: unknown }).ibanlar;
    if (!Array.isArray(liste)) return hataCevabi('json', 'ibanlar bir dizi olmalı');
    if (liste.length > EN_FAZLA) return hataCevabi('cok', `Tek istekte en fazla ${EN_FAZLA} IBAN`);
    return cevap(liste.map(sonuc));
  }
  if (govde && typeof govde === 'object' && 'iban' in govde) {
    return cevap(sonuc((govde as { iban: unknown }).iban));
  }
  return hataCevabi('eksik', 'Gövdede iban ya da ibanlar alanı yok');
}
