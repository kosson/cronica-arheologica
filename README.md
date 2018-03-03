# cronica-arheologica

![](fragmente.jpg)

Acesta este API-ul destinat agregării datelor privind cronicile arheologice.

Pentru a instala aplicația următoarele componente trebuie să existe deja instalate pe sistemul server:

- Node.js și npm
- MongoDB,
- Postman (pentru a interoga și scrie date).

Pasul 1:
Din linia de comandă: `$ npm install` pentru a instala toate dependințele

Pasul 2:
Din linia de comandă pornește execuția aplicației: `$ npm start`

Pasul 3:
Folosește Postman pentru a introduce pe căile `/cronicile` și  `/preloadere` modelele de date agregate pentru test.
Acestea pot fi găsite în rădăcină.

- `model.Cronica.json` pentru a încărca date ce țin de cronici și
- `preloaders.date.json` pentru date necesare mecanismelor de preîncărcare a interfeței.