class TMDB{

    constructor(apiKljuc, stranicenje){
        this.apiKljuc = apiKljuc;
        this.appStranicenje = stranicenje;
    }

    async pretraziSerijePoNazivu(trazi, trenutnaStranica) {
        let odgovor = await fetch(`https://api.themoviedb.org/3/search/tv?query=${trazi}&api_key=${this.apiKljuc}`);

        let rezultat = await odgovor.json();
        let brojStranica = rezultat.total_pages;

        let poljePromise = [];

        for (let i = 2; i < brojStranica + 1; i++) {
            let stranicaPromise = fetch(`https://api.themoviedb.org/3/search/tv?query=${trazi}&page=${i}&api_key=${this.apiKljuc}`)
                .then(response => response.json());
            poljePromise.push(stranicaPromise);
        }

        let straniceOdgovori = await Promise.all(poljePromise);

        for (let stranicaOdgovor of straniceOdgovori) {
            rezultat.results = rezultat.results.concat(stranicaOdgovor.results);
        }

        //console.log("rezultat.results = " + rezultat.results);

        let povratniPodaci = pripremiStranicenje(rezultat.results, trenutnaStranica, this.appStranicenje);
        //console.log("povratni podaci = " + povratniPodaci.podaci);
        return povratniPodaci;
    }

    async dajSeriju(id){
        let odgovor = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${this.apiKljuc}`);
        let rezultat = await odgovor.json();

        let serija = {
            id : rezultat.id,
            name : rezultat.name,
            overview : rezultat.overview,
            number_of_episodes: rezultat.number_of_episodes,
            number_of_seasons: rezultat.number_of_seasons,
            popularity : rezultat.popularity,
            poster_path : rezultat.poster_path,
            homepage : rezultat.homepage,
            seasons : rezultat.seasons,
            first_air_date : rezultat.first_air_date,
            last_air_date : rezultat.last_air_date,
            original_language : rezultat.original_language,
            original_name : rezultat.original_name,
            vote_average : rezultat.vote_average,
            vote_count : rezultat.vote_count
        };

        console.log(rezultat.number_of_seasons);

        return serija; 
    }

}

function pripremiStranicenje(sviPodaci, trenutnaStranica, brojPoStranici){
    let podaci = [];
    let ukupnoStranica = Math.ceil(sviPodaci.length/brojPoStranici);

    for(let i = (trenutnaStranica*brojPoStranici) - brojPoStranici; i < trenutnaStranica * brojPoStranici; i++){
        if(sviPodaci[i] != null){
            podaci.push(sviPodaci[i]);
        }
    }
    return {results: podaci, current_page: trenutnaStranica, total_pages: ukupnoStranica};
}

module.exports = TMDB;