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
Folosește Postman pentru a testa căile. Descarcă Postman de la https://www.getpostman.com/

Pentru a folosi rutele protejate (POST, DELETE) va trebui mai întâi să faci cont mergând pe calea `/user/signin` și apoi să te loghezi la sistem urmând calea `/user/login`. Abia după aceea poți folosi rutele protejate. Pentru a lucra cu Postman și a obține o autentificare, vezi mai jos descrierea rutelor de `signin` și `login`.

## Accesarea resurselor

### GET localhost:8000/cronicile

Setează în Postman o rută de GET direct pe calea `cronicile`. Răspunsul este un json dacă ai date în bază

### GET localhost:8000/cronicile/idulCunoscutAlUneiÎnregistrari

Setează în Postman o rută GET pe calea `cronicile`. Răspunsul este un json pentru o înregistrare unică cunoscută.

### POST localhost:8000/cronicile

ATENȚIE! Aceasta este o rută protejată!!! Trebuie să ai cont și să fii autorizat.

Setează în Postman o rută POST prin care să introduci înregistrări în bază.
Body setează-l la raw cu opțiunea JSON(application/JSON). Întrodu obiectul JSON și Send. La valoarea `Authorization` din headet vei pune stringul `Bearer` urmat de un spațiu și apoi de stringul tokenului emis la momentul logării.

### PATCH localhost:8000/cronicile/idulCunoscutAlUneiÎnregistrari

ATENȚIE! Aceasta este o rută protejată!!! Trebuie să ai cont și să fii autorizat.
Această rută modifică informații existente dintr-o înregistrare a cărei ID este cunoscut.
Body setează-l la raw cu opțiunea JSON(application/JSON). Întrodu obiectul JSON care actualizează câmpurile dorite și Send. La valoarea `Authorization` din headet vei pune stringul `Bearer` urmat de un spațiu și apoi de stringul tokenului emis la momentul logării.

### DELETE localhost:8000/cronicile/idulCunoscutAlUneiÎnregistrari

ATENȚIE! Aceasta este o rută protejată!!! Trebuie să ai cont și să fii autorizat.

Șterge o înregistrare a cărui identificator este cunoscut. La valoarea `Authorization` din headet vei pune stringul `Bearer` urmat de un spațiu și apoi de stringul tokenului emis la momentul logării.

## Gestionarea utilizatorilor

### POST localhost:8000/user/signup

Pe această rută se va trimite un corp JSON (setează raw cu opțiunea JSON (application/json) în setările de Body).
Se va verifica dacă în baza de date există deja un utilizator. Dacă nu, acesta este creat.

### DELETE localhost:8000/user/201

Pe această rută se va șterge un utilizator din bază. Pentru a-l șterge, ai nevoie să cunoști id-ul din bază. Deci, mai întâi asigură-te că pe cererile de pe ruta aceasta conțin informațiile email, parolă și id-ul. Aceste informații le obții construind logică separată pe un GET.

### POST localhost:8000/user/login

Pentru a accesa rutele protejate, mai întâi de toate trebuie să fi făcut cont și apoi să te loghezi pentru a genera un token. Tokenul este setat să fie valabil pentru o sesiune de lucru de 6 ore. În Postman accesezi ruta `/user/login` după care setezi `Body` să fie un json. În JSON vei pune email și password cu datele unui cont cunoscut. În acest moment se generează tokenul, care trebuie notat undeva pentru a fi inserat în headerele cererilor pe rutele protejate.

La valoarea `Authorization` din headerul oricărei rute protejate, vei pune stringul `Bearer` urmat de un spațiu și apoi de stringul tokenului. Middleware-ul `chekAuth` trebuie să stea înaintea oricărui alt middleware folosit la momentul constituirii rutelor protejate.