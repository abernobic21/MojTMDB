const KorisnikDAO = require("./korisnikDAO.js");
const jwt = require("../aplikacija/moduli/jwt.js");
const kodovi = require("../aplikacija/moduli/kodovi.js");
const recaptcha = require("../aplikacija/moduli/reCaptcha.js")
const totp = require("../aplikacija/moduli/totp.js")

class restKorisnik{
    constructor(tajniKljucJWT, jwtValjanost){
        this.tajniKljucJWT = tajniKljucJWT;
        this.jwtValjanost = jwtValjanost;
    };

getKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "GET", zahtjev.url, zahtjev.body);
    if(zahtjev.session.uloga != 2){
        odgovor.status(403);
        odgovor.json({ greska: "zabranjen pristup" });
    }else if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    } else if(zahtjev.query && Object.keys(zahtjev.query).length > 0){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    }else{
    let kdao = new KorisnikDAO();
    kdao.dajSve().then((korisnici) => {
        odgovor.status(200);
        odgovor.send(JSON.stringify(korisnici));
    }).catch((error) => {
        odgovor.status(400);
        odgovor.json({ greska: error.message });
    });
}
}

postKorisnici = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    dodajDnevnickiZapis(zahtjev.session.korime, "POST", zahtjev.url, zahtjev.body);
    if(zahtjev.session.uloga != 2){
        odgovor.status(403);
        odgovor.json({ greska: "zabranjen pristup" });
    }else if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    } else if(zahtjev.query && Object.keys(zahtjev.query).length > 0){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    }else {
        let token = zahtjev.body.token;
        let podaci = zahtjev.body.korisnik;
        try{
            validacija(podaci.korime, podaci.email, podaci.lozinka, podaci.ime, podaci.prezime, podaci.datumRodenja, podaci.telefon);
        }catch(error){
            odgovor.status(400);
            odgovor.json({ greska: error.message });
            return;
        };

        if(!await recaptcha.provjeriRecaptchu(token)){
            odgovor.status(417);
            odgovor.send({greska: "Pogrešna recaptcha!"});
            return;
        }
        let kdao = new KorisnikDAO();
        let sol = podaci.korime.split('').reverse().join('');
		podaci.lozinka = kodovi.kreirajSHA256(podaci.lozinka, sol);
        kdao.dodaj(podaci).then((poruka) => {
            odgovor.status(201);
            odgovor.json({opis: "korisnik dodan" });
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json({ greska: error.message });
        });
    }
}

putKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "PUT", zahtjev.url, zahtjev.body);
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

deleteKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "DELETE", zahtjev.url, zahtjev.body);
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "GET", zahtjev.url, zahtjev.body);
    if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    } else if(Object.keys(zahtjev.query).length > 0 && zahtjev.query){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    }else {
        let kdao = new KorisnikDAO();
        let korime = zahtjev.params.korime;
        kdao.daj(korime).then((korisnik) => {
            odgovor.status(200);
            odgovor.send(JSON.stringify(korisnik));
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json({ greska: error.message });
        });
    }
}

postKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "POST", zahtjev.url, zahtjev.body);
    odgovor.status(405);
    let poruka = { greska: "zabranjeno" }
    odgovor.send(JSON.stringify(poruka));
}

putKorisnik = async function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "PUT", zahtjev.url, zahtjev.body);
    if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    }else if(Object.keys(zahtjev.query).length > 0 && zahtjev.query){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    } else {
        let korime = zahtjev.params.korime;
        let podaci = zahtjev.body.korisnik;
        let token = zahtjev.body.token;
        
        console.log(zahtjev.body);

        try{
            validacija(
                korime,
                "email@gmail.com", 
                podaci.lozinka !== '' ? podaci.lozinka : "defaultLozinka", 
                podaci.ime, 
                podaci.prezime, 
                podaci.datumRodenja, 
                podaci.telefon);
        }catch(error){
            odgovor.status(400);
            odgovor.json({ greska: error.message });
            return;
        };

        if(!await recaptcha.provjeriRecaptchu(token)){
            odgovor.status(417);
            odgovor.send({greska: "Pogrešna recaptcha!"});
            return;
        }
        
        if(podaci.lozinka != ''){
            let sol = korime.split('').reverse().join('');
		    podaci.lozinka = kodovi.kreirajSHA256(podaci.lozinka, sol);
        }
        
        let kdao = new KorisnikDAO();
        kdao.azuriraj(korime, podaci).then((poruka) => {
            odgovor.status(201);
            odgovor.json({opis: "korisnik ažuriran"})
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json({ greska: error.message });
        });
    }
}

deleteKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "DELETE", zahtjev.url, zahtjev.body);
    if(zahtjev.session.uloga != 2){
        odgovor.status(403);
        odgovor.json({ greska: "zabranjen pristup" });
    }else if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    }else if(Object.keys(zahtjev.query).length > 0 && zahtjev.query){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    } else {
        let kdao = new KorisnikDAO();
        let korime = zahtjev.params.korime;
        kdao.obrisi(korime).then((poruka) => {
            odgovor.status(201);
            odgovor.json({ opis: "korisnik obrisan" });
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json({ greska: error.message });
        });
    }
}

getFavoriti = function (zahtjev, odgovor){
    odgovor.type("application/json");
    dodajDnevnickiZapis(zahtjev.session.korime, "GET", zahtjev.url, zahtjev.body);
    console.log(zahtjev.headers.authorization);
    if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    } else if(zahtjev.query && Object.keys(zahtjev.query).length > 0){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    }else{
        let kdao = new KorisnikDAO();
        let korime = jwt.dajTijelo(zahtjev.headers.authorization).korime;
        kdao.dajFavorite(korime).then((poruka) => {
            odgovor.status(200);
            odgovor.send(JSON.stringify(poruka));
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json( {greska: error.message})});
}
}

postFavoriti = function (zahtjev, odgovor){
    odgovor.type("application/json");
    dodajDnevnickiZapis(zahtjev.session.korime, "POST", zahtjev.url, zahtjev.body);
    if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    }else if(zahtjev.query && Object.keys(zahtjev.query).length > 0){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    }else {
        let kdao = new KorisnikDAO();
        let korime = zahtjev.session.korime;
        let serija = zahtjev.body;
        kdao.dodajFavorita(korime, serija).then((poruka) => {
            odgovor.status(201);
            odgovor.json({opis: "Serija dodana u popis favorita"});
        }).catch((error) => {
            odgovor.status(400);
             odgovor.json( {greska: error.message})});
    }
}

putFavoriti = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "PUT", zahtjev.url, zahtjev.body);
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

deleteFavoriti = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "DELETE", zahtjev.url, zahtjev.body);
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

getFavorit = function (zahtjev, odgovor){
    odgovor.type("application/json");
    dodajDnevnickiZapis(zahtjev.session.korime, "GET", zahtjev.url, zahtjev.body);
    if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    }else if(zahtjev.query && Object.keys(zahtjev.query).length > 0){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    } else {
    let kdao = new KorisnikDAO();
    let korime = zahtjev.session.korime;
    let id = zahtjev.params.id;
    kdao.dajFavorita(korime, id).then((poruka) => {
        odgovor.status(200);
        odgovor.send(JSON.stringify(poruka));
    }).catch((error) => {
        odgovor.status(400);
        odgovor.json( {greska: error.message})});
}
}

postFavorit = function (zahtjev, odgovor){
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "POST", zahtjev.url, zahtjev.body);
    odgovor.status(405);
    let poruka = { greska: "zabranjeno" }
    odgovor.send(JSON.stringify(poruka));
}

putFavorit = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "PUT", zahtjev.url, zahtjev.body);
    odgovor.status(405);
    let poruka = { greska: "zabranjeno" }
    odgovor.send(JSON.stringify(poruka));
}

deleteFavorit = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "DELETE", zahtjev.url, zahtjev.body);
    if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    }else if(zahtjev.query && Object.keys(zahtjev.query).length > 0){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    } else {
        let kdao = new KorisnikDAO();
        let korime = zahtjev.session.korime;
        let id = zahtjev.params.id;
        kdao.obrisiFavorita(korime, id).then((poruka) => {
            odgovor.status(201);
            odgovor.json({opis: "favorit obrisan"});
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json( {greska: error.message})});
    }
}

postKorisnikPrijava = async function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "POST", zahtjev.url, zahtjev.body);

    if(zahtjev.query && Object.keys(zahtjev.query).length > 0){
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    }else if(!zahtjev.body){
        odgovor.status(400);
        odgovor.json({greska: "Zahtjev na sadrži tijelo."});
    }else{
        let tijelo = Object.entries(zahtjev.body);        

        if (tijelo.length > 4) {
            odgovor.status(400);
            odgovor.json({ greska: "Previše parametara u zahtjevu." });
            return;
        }

        if (!zahtjev.body.korime || !zahtjev.body.lozinka) {
            odgovor.status(400);
            odgovor.json({ greska: "Neispravni podaci u zahtjevu." });
            return;
        }

        let token = zahtjev.body.token;

        if(!await recaptcha.provjeriRecaptchu(token)){
            odgovor.status(417);
            odgovor.send({greska: "Pogrešna recaptcha!"});
            return;
        }

        let kdao = new KorisnikDAO();
        let totpKod = zahtjev.body.totpKod;
        let korime = zahtjev.body.korime;
		let sol = korime.split('').reverse().join('');
		let lozinka = kodovi.kreirajSHA256(zahtjev.body.lozinka, sol);

        kdao.dajZaPrijavu(korime).then((korisnik) => {
            if(korisnik!=null && korisnik.lozinka==lozinka){
        console.log("korisnik", korisnik);        
                if(korisnik.totpAktivan && totpKod == ""){
                    odgovor.status(200);
                    odgovor.json({
                        message: "Potreban totp",
                      });
                    return;
                }else if(korisnik.totpAktivan && !totp.provjeriTOTP(totpKod, korisnik.totp)){
                    odgovor.status(401);
                    odgovor.send({greska: "Krivi TOTP kod!"});
                    return;
                }
				zahtjev.session.korime = korisnik.korime;
                zahtjev.session.uloga = korisnik.tip_korisnika_id; 
                odgovor.status(201);
                odgovor.json({opis: "sesija kreirana"});
            }
            else{
                odgovor.status(400)
                odgovor.send(JSON.stringify({greska: "Krivi podaci!"}))
            }
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json( {greska: error.message})});
        }
}

getKorisnikPrijava = function (zahtjev, odgovor) {
    dodajDnevnickiZapis(zahtjev.session.korime, "GET", zahtjev.url, zahtjev.body);
    if (zahtjev.query && Object.keys(zahtjev.query).length > 0) {
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
        return;
    }

    if (zahtjev.session.korime != null) {
        let k = { korime: zahtjev.session.korime };
        let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT, this.jwtValjanost);
        odgovor.setHeader('Authorization', noviToken);
        odgovor.headers = {};
        odgovor.headers.Authorization = 'Bearer ' + noviToken;
        
        //console.log(odgovor);
        odgovor.status(200).send({ ok: 'Valid session', token: noviToken });
    } else {
        odgovor.status(401).send({ greska: "zabranjen pristup" });
    }
}

postTotp = function(zahtjev, odgovor){
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "POST", zahtjev.url, zahtjev.body);
    if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    }else if(zahtjev.query && Object.keys(zahtjev.query).length > 0){ 
        odgovor.status(417);
        odgovor.json({ greska: "neočekivani podaci" });
    } else {
        let korime = zahtjev.session.korime;
        let totpKod = totp.kreirajTajniKljuc(korime);

        console.log("totpkod",totpKod);
 
        let kdao = new KorisnikDAO();
        kdao.dodajTotp(korime, totpKod).then((totpKljuc) => {
            odgovor.status(201);
            odgovor.send(JSON.stringify(totpKljuc));
        }).catch((error) => {
            odgovor.status(400);
            odgovor.json({ greska: error.message });
        });
    }
    
}

getDnevnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    dodajDnevnickiZapis(zahtjev.session.korime, "GET", zahtjev.url, zahtjev.body);
    if(zahtjev.session.uloga != 2){
        odgovor.status(403);
        odgovor.json({ greska: "zabranjen pristup" });
    }else if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
        odgovor.status(401);
        odgovor.json({ greska: "potrebna prijava" });
    } else{
        let stranica = zahtjev.query.stranica;
        let sortiraj = zahtjev.query.sortiraj;
        let datumOd = zahtjev.query.datumOd;
        let datumDo = zahtjev.query.datumDo;
        let vrijemeOd = zahtjev.query.vrijemeOd;
        let vrijemeDo = zahtjev.query.vrijemeDo;

        let kdao = new KorisnikDAO();
        kdao.dajDnevnickeZapise(stranica, sortiraj, datumOd, datumDo, vrijemeOd, vrijemeDo).then((zapisi) => {
            odgovor.status(200);
            odgovor.send(JSON.stringify(zapisi));
    }).catch((error) => {
        odgovor.status(400);
        odgovor.json({ greska: error.message });
    });
}
}

}
module.exports = restKorisnik;

function dodajDnevnickiZapis(korime, metoda,trazeniResurs, tijelo){
    let trenutnoVrijeme = new Date();
    let zapis = {
        datum: trenutnoVrijeme.toLocaleDateString(),
        vrijeme: trenutnoVrijeme.toLocaleTimeString(),
        korime: korime,
        metoda: metoda,
        trazeniResurs: trazeniResurs,
        tijelo: JSON.stringify(tijelo),
    };
    console.log("zapisssssss:", zapis);
    let kdao = new KorisnikDAO();
    kdao.dodajDnevnickiZapis(zapis).then((poruka) => {
        console.log("Dnevnik: ", poruka);
    }).catch((error) => {
        console.log("Dnevnik greska: ", error.message );
    });
}

function validacija(korime, email, lozinka, ime, prezime, datumRodenja, telefon) {

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error(`Email nije u ispravnom obliku.`);
    }
 
    let datumRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
    if (datumRodenja && !datumRegex.test(datumRodenja)) {
        throw new Error("Datum rođenja nije u formatu dd.mm.yyyy.");
    }

    let telefonRegex = /^(\+)?\d+$/;
    if (telefon && !telefonRegex.test(telefon)) {
        throw new Error("Broj telefona nije u ispravnom obliku.");
    }

    let imePrezimeRegex = /^[a-zA-ZčćžšđČĆŽŠĐ\s]+$/;
    if (ime && !imePrezimeRegex.test(ime) || prezime && !imePrezimeRegex.test(prezime)) {
        throw new Error("Ime i prezime mogu sadržavati samo slova.");
    }

    if (!korime || !email || !lozinka) {
        throw new Error("Korime, e-mail i lozinka su obavezni.");
    }
}

