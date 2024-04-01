import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SerijeTmdbI, SerijaTmdbDetaljiI } from './SerijeTmdbI';
import { SerijaDetaljiComponent } from '../serija-detalji/serija-detalji.component';
import { AutorizacijaService } from './autorizacija.service';

@Injectable({
  providedIn: 'root'
})
export class SerijeService {

  restServis = environment.restServis;

  constructor(private autorizacijaServis: AutorizacijaService) {
  } 

  async dajSerije(trenutnaStranica: number, trazi: string){

    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let parametri = `?stranica=${trenutnaStranica}&trazi=${trazi}`;
    let odgovor = (await fetch(this.restServis + `api/tmdb/serije` + parametri, {
      method: "GET",
      headers: headers,
    })) as Response;
  
    if(odgovor.status == 200){
      let podaciSerija = JSON.parse(await odgovor.text()) as SerijeTmdbI;
      console.log(podaciSerija);
      return podaciSerija;
    }
    
    throw new Error("Greška pri dohvaćanju podataka");
  }

  async dajSeriju(id: number){
    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }
    
    let parametri = `?id=${id}`;
    let odgovor = (await fetch(this.restServis + `api/tmdb/serijaDetalji` + parametri, {
      method: "GET",
      headers: headers,
    })) as Response;

    if(odgovor.status == 200){
      let serijaDetaji = JSON.parse(await odgovor.text()) as SerijaTmdbDetaljiI;
      return serijaDetaji;
    }
    
    throw new Error("Greška pri dohvaćanju podataka");
  }

  async dodajFavorita(serija?: SerijaTmdbDetaljiI){

    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let odgovor = await fetch(this.restServis + "baza/favoriti", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(serija)});

    if (odgovor.status == 201) {
      return true;
    }else{
      return false;
    }
  }

  async dajFavorite(){

    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let odgovor = await fetch(this.restServis  +"baza/favoriti", {
      method: "GET",
      headers: headers,
    });
    
    if(odgovor.ok) {
      let serije = await odgovor.json();
      console.log(serije);
      return serije; 
    }
   }

   async dajFavorita(id: number){

    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }

    let odgovor = await fetch(this.restServis + "baza/favoriti/" + id, {
      method: "GET",
      headers: headers,
    });
    
    if(odgovor.ok) {
      let serija = await odgovor.json();
      console.log(serija);
      return serija; 
    }
   }
}
