// Derlenmiş paketi ve banka listesini public/ altına koyar. Vercel derlemesinde çalışıyor.
import { copyFileSync, writeFileSync } from 'node:fs';
import { BANKALAR, LISTE_TARIHI } from '../dist/index.js';

copyFileSync('dist/index.js', 'public/iban-tr.js');
writeFileSync('public/bankalar.json', `${JSON.stringify({ tarih: LISTE_TARIHI, bankalar: BANKALAR }, null, 2)}\n`);
console.log(`public/iban-tr.js, public/bankalar.json (${BANKALAR.length} banka)`);
