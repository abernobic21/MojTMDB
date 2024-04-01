import express from "express";
import cors from "cors";
import kolacici from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import sesija from "express-session";
import Konfiguracija from "./aplikacija/konfiguracija.js";
import RestTMDB from "./aplikacija/restTMDB.js";
import RestKorisnik from "./aplikacija/restKorisnik.js";
import Github from "./aplikacija/moduli/github.js"
//import portovi from "/var/www/RWA/2023/portovi.js";


const port = 12001;//iz nekog razloga ne zeli radit na 12000
const server = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
  };
  
  server.use(cors(corsOptions));

let konf = new Konfiguracija();
konf
	.ucitajKonfiguraciju()
	.then(pokreniServer)
	.catch((greska) => {
		if (process.argv.length == 2) {
			console.error("Molim unesite naziv datoteke!");
		} else {
			console.error(greska.message);
		}
	});

function pokreniServer(){
let restTMDB = new RestTMDB(konf.dajKonf()["tmdbApiKeyV3"], konf.dajKonf()["appStranicenje"], konf.dajKonf()["jwtTajniKljuc"]);
let restKorisnik = new RestKorisnik(konf.dajKonf().jwtTajniKljuc, konf.dajKonf().jwtValjanost);
let github = new Github(konf.dajKonf().githubClientId, konf.dajKonf().githubTajniKljuc);

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(kolacici());
server.use(
    sesija({
        secret: konf.dajKonf().tajniKljucSesija,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 3 },
        resave: false,
    })
);

server.get("/api/tmdb/serije", restTMDB.getSerije.bind(restTMDB));
server.get("/api/tmdb/serijaDetalji", restTMDB.getSerija.bind(restTMDB));
 
server.get("/baza/korisnici", restKorisnik.getKorisnici.bind(restKorisnik));
server.post("/baza/korisnici", restKorisnik.postKorisnici.bind(restKorisnik));
server.put("/baza/korisnici", restKorisnik.putKorisnici.bind(restKorisnik));
server.delete("/baza/korisnici", restKorisnik.deleteKorisnici.bind(restKorisnik));

server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik.bind(restKorisnik));
server.post("/baza/korisnici/:korime", restKorisnik.postKorisnik.bind(restKorisnik));
server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik.bind(restKorisnik));
server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik.bind(restKorisnik));

server.get("/baza/favoriti", restKorisnik.getFavoriti.bind(restKorisnik));
server.post("/baza/favoriti", restKorisnik.postFavoriti.bind(restKorisnik));
server.put("/baza/favoriti", restKorisnik.putFavoriti.bind(restKorisnik));
server.delete("/baza/favoriti", restKorisnik.deleteFavoriti.bind(restKorisnik));

server.get("/baza/favoriti/:id", restKorisnik.getFavorit.bind(restKorisnik));
server.post("/baza/favoriti/:id", restKorisnik.postFavorit.bind(restKorisnik));
server.put("/baza/favoriti/:id", restKorisnik.putFavorit.bind(restKorisnik));
server.delete("/baza/favoriti/:id", restKorisnik.deleteFavorit.bind(restKorisnik));

server.get("/baza/dnevnik", restKorisnik.getDnevnik.bind(restKorisnik));

server.get("/baza/korisnici/:korime/prijava", restKorisnik.getKorisnikPrijava.bind(restKorisnik));
server.post("/baza/korisnici/:korime/prijava", restKorisnik.postKorisnikPrijava.bind(restKorisnik));
server.get("odjava", (zahtjev, odgovor) => {
    zahtjev.session.destroy((e) => {
        if(e)
            console.log(e);
    });
    odgovor.status(200);
    odgovor.json({ poruka: "Odjava uspješna." });
})

server.post("/baza/korisnici/:korime/totp", restKorisnik.postTotp.bind(restKorisnik));

server.get("/githubPrijava", (zahtjev, odgovor) => {
    odgovor.json((github.dajGithubAuthURL("http://localhost:" + port +"/githubPovratno")));
})

server.get("/githubPovratno", async (zahtjev, odgovor) =>{
    let token = await github.dajAccessToken(zahtjev.query.code);
	zahtjev.session.githubToken = token;
	odgovor.redirect("/githubPocetna");
})

server.get("/githubProvjera", async (zahtjev,odgovor) => {
    let podaci = await github.provjeriToken(zahtjev.session.githubToken);
    if(podaci.login){
        zahtjev.session.korime = podaci.login;
        odgovor.status(200);
        odgovor.json(podaci);
    }else{
        odgovor.status(400);
        odgovor.json({greska: "Neuspješna prijava putem Githuba"});
    }
})

server.get("/githubOdjava", async (zahtjev, odgovor) => {
    zahtjev.session.destroy((e) => {
        if(e)
            console.log(e);
    });
    odgovor.status(200);
    odgovor.json({ poruka: "Odjava uspješna." });
})

server.use(express.static(path.join(__dirname, '../server/angular')));


    server.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../server/angular/index.html'));
    });


server.use((zahtjev, odgovor) => {
    odgovor.status(404);
    odgovor.json({ opis: "nema resursa" });
    });

server.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
});

}

