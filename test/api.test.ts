import { describe, expect, it } from 'vitest';
import { GET, OPTIONS, POST } from '../api/dogrula';

const URL_ = 'https://ornek.test/api/dogrula';
const oku = async (c: Response | Promise<Response>): Promise<any> => (await c).json();
const post = (govde: unknown) =>
  POST(new Request(URL_, { method: 'POST', body: typeof govde === 'string' ? govde : JSON.stringify(govde) }));

describe('api/dogrula', () => {
  it('GET', async () => {
    const c = GET(new Request(`${URL_}?iban=TR20%200006%202000%200000%200006%202987%2065`));
    expect(c.status).toBe(200);
    expect(c.headers.get('access-control-allow-origin')).toBe('*');
    expect(await oku(c)).toMatchObject({
      gecerli: true,
      iban: 'TR200006200000000006298765',
      bicimli: 'TR20 0006 2000 0000 0006 2987 65',
      banka: { kod: '00062', kisaAd: 'Garanti BBVA' },
      hata: null,
    });
  });

  it('GET parametresiz', async () => {
    const c = GET(new Request(URL_));
    expect(c.status).toBe(400);
    expect((await oku(c)).hata.kod).toBe('eksik');
  });

  it('POST tek ve toplu', async () => {
    expect((await oku(post({ iban: 'TR210006200000000006298765' }))).hata.kod).toBe('kontrol');
    const liste = await oku(post({ ibanlar: ['TR200006200000000006298765', 'abc', 5] }));
    expect(liste.map((x: { gecerli: boolean }) => x.gecerli)).toEqual([true, false, false]);
  });

  it('metin olmayan ve çok uzun öğe aynı şemada', async () => {
    const [sayi, uzun] = await oku(post({ ibanlar: [5, 'TR'.repeat(100)] }));
    expect(sayi).toEqual({ gecerli: false, iban: '', bicimli: null, banka: null, uyari: null, hata: { kod: 'tur', mesaj: 'IBAN metin olmalı' } });
    expect(uzun.hata.kod).toBe('uzunluk');
    expect(uzun.iban).toBe('');
  });

  it('POST hatalı gövde', async () => {
    expect((await post('{bozuk')).status).toBe(400);
    expect((await post({ ibanlar: 'TR..' })).status).toBe(400);
    expect((await post({ ibanlar: Array(101).fill('TR') })).status).toBe(400);
    expect((await post({ baska: 1 })).status).toBe(400);
  });

  it('OPTIONS', () => {
    expect(OPTIONS().status).toBe(204);
  });
});
