const TMDB = require("./TMDB.js");
const jwt = require("../aplikacija/moduli/jwt.js");

class restTMDB{

    constructor(apiKljuc, stranicenje, tajniKljucJWT){
        this.TMDB = new TMDB(apiKljuc, stranicenje);
        this.tajniKljucJWT = tajniKljucJWT;
    }

    getSerije(zahtjev, odgovor) {
        odgovor.type("application/json");
        if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
            odgovor.status(401);
            odgovor.json({ greska: "potrebna prijava" })
            return;
        }
        let stranica = zahtjev.query.stranica;
        let trazi = zahtjev.query.trazi;
        this.TMDB.pretraziSerijePoNazivu(trazi, stranica).then((serije) =>{
            odgovor.send(serije);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }

    getSerija(zahtjev, odgovor){
        odgovor.type("application/json");
        if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
            odgovor.status(401);
            odgovor.json({ greska: "potrebna prijava" });
            return;
        }
        let id = zahtjev.query.id;
        this.TMDB.dajSeriju(id).then((serija) => {
            odgovor.send(serija);
        }).catch((greska) => {
            odgovor.json(greska);
        })
    }
}

module.exports = restTMDB;