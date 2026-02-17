# MojTMDB

Ovaj projekt predstavlja razvoj web aplikacije za prikaz i upravljanje podacima o TV serijama izrađene u sklopu kolegija Razvoj web aplikacija. 

Aplikacija je realizirana korištenjem Angular okvira na klijentskoj strani te Node.js poslužitelja s REST servisom na pozadinskoj strani, uz SQLite bazu podataka. 

Sustav omogućuje pretraživanje i dohvat podataka o serijama putem vanjskog servisa TMDB, pri čemu klijentska aplikacija komunicira isključivo s vlastitim pozadinskim REST servisom. 
Implementirana je autentifikacija korisnika pomoću JWT mehanizma, uz mogućnost dvorazinske autentifikacije (TOTP), prijave putem GitHub OAuth sustava te zaštite obrazaca pomoću reCaptcha v3. 
Aplikacija koristi Sass/Scss za stiliziranje sučelja, a posebna pažnja posvećena je organizaciji koda, sigurnosti, validaciji korisničkih unosa i pravilnoj strukturi projekta. 

Cilj projekta bio je objediniti rad s REST servisima, autentifikacijom, vanjskim API-jem i modernim frontend okvirom u funkcionalnu i sigurnu web aplikaciju.
