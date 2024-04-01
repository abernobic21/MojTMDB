const ds = require("fs/promises");
class Konfiguracija {
	constructor() {
		this.konf = {};
	}
	dajKonf() {
		return this.konf;
	}
	async ucitajKonfiguraciju() {
		//console.log(this.konf);
		try{
			await ds.access(process.argv[2], ds.constants.F_OK);
		}catch(err){
			throw new Error(`Datoteka ${process.argv[2]} ne postoji.`);
		};
		let podaci = await ds.readFile(process.argv[2], "UTF-8");
		this.konf = pretvoriJSONkonfig(podaci);
		validirajKonfiguraciju(this.konf);
		//console.log(this.konf);
	}
}

function pretvoriJSONkonfig(podaci) {
	//console.log(podaci);
	let konf = {};
	var nizPodataka = podaci.split("\n");
	for (let podatak of nizPodataka) {
		var podatakNiz = podatak.split(":");
		var naziv = podatakNiz[0];
		var vrijednost = podatakNiz[1];
		konf[naziv] = vrijednost;
	}
	return konf;
}

function validirajKonfiguraciju(konf){
	const konfiguracijskiPodaci = ["jwtValjanost", "jwtTajniKljuc", "tajniKljucSesija", "appStranicenje", "tmdbApiKeyV3", "tmdbApiKeyV4", "tajniKljucCaptcha", "githubClientId", "githubTajniKljuc"];

	for(let podatak of konfiguracijskiPodaci){
		if(!konf[podatak]){
			throw new Error(`Nedostaje podatak ${podatak} u konfiguracijskoj datoteci.`);
		}
	}

	for(let podatak in konf){
		if(!(konfiguracijskiPodaci.includes(podatak))){
			throw new Error(`Nepoznat podatak ${podatak} u konfiguracijskoj datoteci.`);
		}
	}

	provjeriBroj(konf, "jwtValjanost", 15, 3600);
	provjeriBroj(konf, "appStranicenje", 5, 100);

	provjeriKljuc(konf, "jwtTajniKljuc");
	provjeriKljuc(konf, "tajniKljucSesija");
}

function provjeriBroj(konf, podatak, min, max){
	if(isNaN(konf[podatak])){
		throw Error(podatak + " mora biti broj.");
	}else if(konf[podatak] < min || konf[podatak] > max){
		throw new Error(`${podatak}  mora biti između ${min} i ${max}.`);
	}
}

function provjeriKljuc(konf, podatak){
	const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(konf[podatak])) {
        throw new Error(podatak + " mora sadržavati samo mala i velika slova te brojeve.");
    }

	if(konf[podatak].length < 50 || konf[podatak].length > 100){
		throw new Error(podatak + " mora sadržavati 50 - 100 znakova.");
	}
}

module.exports = Konfiguracija;
