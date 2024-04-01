const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza("RWA2023abernobic21.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT korime, email, lozinka, ime, prezime, adresa, datumRodenja, telefon FROM korisnik;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1){

            console.log(korime);
            console.log("podaci prije", podaci[0]);

            podaci[0].totp = podaci[0].totp != null;
            console.log("podaci nakon", podaci[0]);
			return podaci[0];
        }else
			throw new Error(`Korisnik s korisničkim imenom ${korime} ne postoji u bazi.`);
	}

    dajZaPrijavu = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1){
			return podaci[0];
        }else
			throw new Error(`Korisnik s korisničkim imenom ${korime} ne postoji u bazi.`);
	}

    dodajTotp = async function (korime, totp){
        this.baza.spojiSeNaBazu();
		let podaciKorisnik = await this.dajZaPrijavu(korime);
		
        console.log("dodaj totp korisnik", podaciKorisnik);
        if(podaciKorisnik.totp != null){
            console.log("postoji vec");
            throw new Error("Totp ključ već postoji");
        }

            let sql = `UPDATE korisnik SET totp=? WHERE korime=?`; 
            let podaci = [totp, korime];
            this.baza.spojiSeNaBazu();
            await this.baza.izvrsiUpit(sql,podaci);
            this.baza.zatvoriVezu();

            let korisnik = await this.dajZaPrijavu(korime);
            console.log("generiran totp", korisnik);
            return korisnik.totp;
    }

	dodaj = async function (korisnik) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?";
		var podaci = await this.baza.izvrsiUpit(sql, [korisnik.korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1){
            throw new Error("Korisničko ime je zazeto");
        }else{
            sql = `INSERT INTO korisnik (korime,email,lozinka,ime,prezime,adresa,datumRodenja,telefon,tip_korisnika_id, totpAktivan) VALUES (?,?,?,?,?,?,?,?,?,?)`;
            let podaci = [korisnik.korime,korisnik.email,korisnik.lozinka,korisnik.ime,korisnik.prezime,korisnik.adresa,korisnik.datumRodenja,korisnik.telefon,1, false];
            this.baza.spojiSeNaBazu();
            await this.baza.izvrsiUpit(sql,podaci);
            this.baza.zatvoriVezu();
            return true;
        }
    }

	azuriraj = async function (korime, korisnik) {
        this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?";
		var podaciKorisnik = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaciKorisnik[0] == null){
            throw new Error(`Korisničko ime ${korime} ne postoji u bazi podataka`);
        }else{

            if(korisnik.lozinka == null || korisnik.lozinka == undefined || korisnik.lozinka == ''){
                korisnik.lozinka = podaciKorisnik[0].lozinka;
            }

            let sql = `UPDATE korisnik SET lozinka=?, ime=?, prezime=?, adresa=?, datumRodenja=?, telefon=?, totpAktivan=? WHERE korime=?`;
            let podaci = [korisnik.lozinka,korisnik.ime,korisnik.prezime,korisnik.adresa,korisnik.datumRodenja, korisnik.telefon, korisnik.totpAktivan, korime];
            this.baza.spojiSeNaBazu();
            await this.baza.izvrsiUpit(sql,podaci);
            this.baza.zatvoriVezu();
            return true;
	    }
    }

    obrisi = async function (korime) {
        let korisnik = await this.daj(korime);
        if(!korisnik){
            throw new Error(`Korisničko ime ${korime} ne postoji u bazi podataka`);
        }else if(korisnik.tip_korisnika_id == 2){
            throw new Error("Nije moguće izbrisati administratora.");
        }
		let sql = "DELETE FROM korisnik WHERE korime=?";
        this.baza.spojiSeNaBazu();
		await this.baza.izvrsiUpit(sql,[korime]);
        this.baza.zatvoriVezu();
		return true;
	}

    dodajFavorita = async function(korime, serija){
        if(! (await this.postojiSerija(serija.id))){
            let sql = `INSERT INTO serija (id, naziv, opis, broj_sezona, broj_epizoda, popularnost, slika, stranica, prvi_datum_emitiranja, zadnji_datum_emitiranja, originalni_jezik, originalni_naziv, prosjecna_ocjena, broj_glasova) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let podaci = [serija.id, serija.name, serija.overview, serija.number_of_seasons, serija.number_of_episodes, serija.popularity, serija.poster_path, serija.homepage, serija.first_air_date, serija.last_air_date, serija.original_language, serija.original_name, serija.vote_average, serija.vote_count];
            
            try{
                this.baza.spojiSeNaBazu();
                await this.baza.izvrsiUpit(sql,podaci);
            }catch{
                throw new Error("Nisu uneseni ispravni podaci serije");
            }finally{
                this.baza.zatvoriVezu();
            }

            try{
                await this.dodajSezone(serija);
            }catch(e){
                console.log(e);

                throw new Error("Nisu uneseni ispravni podaci o sezonama serije");
            }
        }
        if(! (await this.provjeriFavorita(korime, serija.id))){
            let sql = `INSERT INTO favoriti (korisnik_korime, serija_id) VALUES (?,?)`;
            let podaci = [korime, serija.id];
            this.baza.spojiSeNaBazu();
            await this.baza.izvrsiUpit(sql,podaci);
            this.baza.zatvoriVezu();
        }
        return true;
    }

    dajFavorite = async function(korime) {

        if(! (await this.daj(korime))){
            throw Error;
        }
        this.baza.spojiSeNaBazu();
		let sql = "SELECT serija.* FROM serija JOIN favoriti ON serija.id = favoriti.serija_id WHERE favoriti.korisnik_korime = ?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
        let serije = podaci.map((serija) => ({
            id: serija.id,
            name: serija.naziv,
            overview: serija.opis,
            number_of_episodes: serija.broj_epizoda,
            number_of_seasons: serija.broj_sezona,
            popularity: serija.popularnost,
            poster_path: serija.slika,
            homepage: serija.stranica,
        
            first_air_date: serija.prvi_datum_emitiranja,
            last_air_date: serija.zadnji_datum_emitiranja,
            original_language: serija.originalni_jezik,
            original_name: serija.originalni_naziv,
            vote_average: serija.prosjecna_ocjena,
            vote_count: serija.broj_glasova,
          }));
        
          return serije;
        };

    dajFavorita = async function(korime, id) {
        this.baza.spojiSeNaBazu();
		let sql = "SELECT serija.* FROM serija JOIN favoriti ON serija.id = favoriti.serija_id WHERE favoriti.korisnik_korime = ? AND serija.id = ?;";
		let podaci = await this.baza.izvrsiUpit(sql, [korime, id]);
		this.baza.zatvoriVezu();

        if(podaci[0] == null){
            throw new Error(`Serija s id ${id} nije u favoritima korisnika s korisnickim imenom ${korime}`)
        }

        let serija = {
            id: podaci[0].id,
            name: podaci[0].naziv,
            overview: podaci[0].opis,
            number_of_episodes: podaci[0].broj_epizoda,
            number_of_seasons: podaci[0].broj_sezona,
            popularity: podaci[0].popularnost,
            poster_path: podaci[0].slika,
            homepage: podaci[0].stranica,
            first_air_date: podaci[0].prvi_datum_emitiranja,
            last_air_date: podaci[0].zadnji_datum_emitiranja,
            original_language: podaci[0].originalni_jezik,
            original_name: podaci[0].originalni_naziv,
            vote_average: podaci[0].prosjecna_ocjena,
            vote_count: podaci[0].broj_glasova,
          };

        let sezone = await this.dajSezoneZaSeriju(id);
        serija.seasons = sezone.map((sezona) => ({
                id: sezona.id,
                name: sezona.naziv,
                overview: sezona.opis,
                season_number: sezona.broj_sezone,
                episode_count: sezona.broj_epizoda,
                poster_path: sezona.slika,
                air_date: sezona.datum_emitiranja,
                vote_average: sezona.prosjecna_ocjena,
            }));

		return serija;
    }

    dajSezoneZaSeriju = async function(id) {
        this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM sezona WHERE serija_id = ? ORDER BY naziv;";
		let podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();

        return podaci;
    }


    provjeriFavorita = async function(korime, id) {
        this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM favoriti WHERE favoriti.korisnik_korime = ? AND favoriti.serija_id = ?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime, id]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else
			return null;
    }

    obrisiFavorita = async function(korime, id) {
        if(!await this.provjeriFavorita(korime, id)){
            throw new Error(`Serije s id ${id} ne postoji u favoritima korisnika ${korime}`);
        }
        let sql = "DELETE FROM favoriti WHERE korisnik_korime = ? AND serija_id = ?;";
        this.baza.spojiSeNaBazu();
        this.baza.izvrsiUpit(sql, [korime, id]);
        this.baza.zatvoriVezu();
        return true;
    }

    postojiSerija = async function(id){
        this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM serija WHERE id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else
			return null;
    }

    dodajSezone = async function(serija) {
        for(let sezona of serija.seasons){
            let sql = `INSERT INTO sezona (id, naziv, opis, broj_sezone, broj_epizoda, slika, serija_id, datum_emitiranja, prosjecna_ocjena) VALUES (?,?,?,?,?,?,?,?,?)`;
            let podaci = [sezona.id, sezona.name, sezona.overview, sezona.season_number, sezona.episode_count, sezona.poster_path, serija.id, sezona.air_date, sezona.vote_average];
            this.baza.spojiSeNaBazu();
            await this.baza.izvrsiUpit(sql,podaci);
            this.baza.zatvoriVezu();
        }
    }

    dodajDnevnickiZapis = async function (zapis) {
        this.baza.spojiSeNaBazu();
        let sql = `INSERT INTO dnevnik (datum, vrijeme, korime, metoda, trazeni_resurs, tijelo) VALUES (?,?,?,?,?,?)`;
        let podaci = [zapis.datum, zapis.vrijeme, zapis.korime, zapis.metoda, zapis.trazeniResurs, zapis.tijelo];
        this.baza.spojiSeNaBazu();
        await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
        return "Zapis unesen";
    }

    dajDnevnickeZapise = async function(stranica, sortiraj, datumOd, datumDo, vrijemeOd, vrijemeDo){
        let brojZapisa = await this.dajBrojZapisa();
        
        if(brojZapisa < 1)
            return null;

        let vrijednosti = [];
		let sql = "SELECT * FROM dnevnik WHERE 1= 1";

        if(datumOd){
            sql += " AND datum >= ?";
            vrijednosti.push(datumOd)
        };

        if (datumDo) {
            sql += " AND datum <= ?";
            vrijednosti.push(datumDo);
        }
    
        if (vrijemeOd) {
            sql += " AND vrijeme >= ?";
            vrijednosti.push(vrijemeOd);
        }
    
        if (vrijemeDo) {
            sql += " AND vrijeme <= ?";
            vrijednosti.push(vrijemeDo);
        }

        if (sortiraj == 'd') {
            sql += " ORDER BY datum DESC, vrijeme DESC";
        } else if (sortiraj == 'm') {
            sql += " ORDER BY metoda ASC";
        }

        sql += " LIMIT 10";
        sql += ` OFFSET ${stranica * 10}`;

        console.log(sql);
        console.log(vrijednosti);

        this.baza.spojiSeNaBazu();
		var podaci = await this.baza.izvrsiUpit(sql, vrijednosti);
		this.baza.zatvoriVezu();

        console.log("dnevnik", podaci);
		return { podaci: podaci, brojZapisa: brojZapisa};
    }

    dajBrojZapisa = async function(datumOd, datumDo, vrijemeOd, vrijemeDo) {
        let vrijednosti = [];
        let sql = "SELECT COUNT(*) as broj FROM dnevnik WHERE 1=1";
    
        if (datumOd) {
            sql += " AND datum >= ?";
            vrijednosti.push(datumOd);
        }
    
        if (datumDo) {
            sql += " AND datum <= ?";
            vrijednost.push(datumDo);
        }
    
        if (vrijemeOd) {
            sql += " AND vrijeme >= ?";
            vrijednosti.push(vrijemeOd);
        }
    
        if (vrijemeDo) {
            sql += " AND vrijeme <= ?";
            vrijednosti.push(vrijemeDo);
        }
    
        this.baza.spojiSeNaBazu();
        let brojZapisa = await this.baza.izvrsiUpit(sql, vrijednosti);
        this.baza.zatvoriVezu();

        console.log("dnevnik brojac", brojZapisa);
        return Math.floor(brojZapisa[0].broj/10);
    }

}

module.exports = KorisnikDAO;
