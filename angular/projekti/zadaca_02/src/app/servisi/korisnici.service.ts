import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { KorisnikI } from './KorisnikI';
import { AutorizacijaService } from './autorizacija.service';

declare var grecaptcha: any;

@Injectable({
  providedIn: 'root'
})
export class KorisniciService {

  restServis = environment.restServis;
  
  constructor(private autorizacijaServis: AutorizacijaService) { }

  async dajKorisnike(){

    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let odgovor = await fetch(this.restServis + "baza/korisnici", {
      method: "GET",
      headers: headers,
    });

    if(odgovor.status == 200){
      let korisnici = await odgovor.json();
      return korisnici;
    }

    throw new Error("Greška prilikom dohvaćanja korisnika.");
  }

  async dajKorisnika(){
    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let korime = sessionStorage.getItem('korime');
    let odgovor = await fetch(this.restServis + "baza/korisnici/" + korime, {
      method: "GET",
      headers: headers,
    });

    if(odgovor.status == 200){
      let korisnik = await odgovor.json();
      return korisnik;
    }

    throw new Error("Greška prilikom dohvaćanja profila.");
  }

  async dodajKorisnika(korisnik: KorisnikI): Promise<boolean>{

    return new Promise<boolean>((uspjeh) => {
      grecaptcha.ready(() => {
        grecaptcha.execute('6LcheUIpAAAAAJbWd56D-OgAqYPeL_XbY16sXFN7', {action: 'registracija'}).then(async (token: string) => {
          const odgovor = await this.dodavanjeKorisnika(korisnik, token);
          uspjeh(odgovor);
        })
      })
    })
  }

  async dodavanjeKorisnika(korisnik: KorisnikI, token: string) : Promise<boolean>{
    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    const odgovor = await fetch(this.restServis + "baza/korisnici", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({korisnik, token: token}),
    });

    if (odgovor.status === 201) {
      return true;
    }else {
      return false;
    }
  }

  async azurirajKorisnika(korisnik: KorisnikI){

    return new Promise<boolean>((uspjeh) => {
      grecaptcha.ready(() => {
        grecaptcha.execute('6LcheUIpAAAAAJbWd56D-OgAqYPeL_XbY16sXFN7', {action: 'profil'}).then(async (token: string) => {
          const odgovor = await this.azuriranjeKorisnika(korisnik, token);
          uspjeh(odgovor);
        })
      })
    })
  }

  async azuriranjeKorisnika(korisnik: KorisnikI, token: string){
    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let korime = sessionStorage.getItem('korime');
    let odgovor = await fetch(this.restServis + "baza/korisnici/" + korime, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({korisnik: korisnik, token: token}),
  });

    if (odgovor.ok) {
        console.log("Podaci ažurirani!");
        return true;
    } else {
        console.error("Greška prilikom ažuriranja podataka.");
        return false;
    }
  }

  async obrisiKorisnika(korime: string){
    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let odgovor = await fetch(this.restServis + "baza/korisnici/" + korime, {
      method: "DELETE",
      headers: headers,
  });

    if (odgovor.ok) {
        console.log("Korisnik obrisan!");
    } else {
        console.error("Greška prilikom brisanja korisnika.");
    }
  }

  async dodajTotpKljuc(korime: string){
    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let odgovor = await fetch(this.restServis + "baza/korisnici/" + korime + "/totp", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({korime}),
  });

    if(odgovor.status == 201){
      let totpKljuc = await odgovor.json();
      return totpKljuc;
    }else{
      console.log("Greška pri dodavanju totp ključa!");
    }
  }

}
