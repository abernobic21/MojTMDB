import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AutorizacijaService } from './autorizacija.service';

@Injectable({
  providedIn: 'root'
})
export class DnevnikService {

  restServis = environment.restServis;

  constructor( private autorizacijaServis: AutorizacijaService) { }

  async dajZapise(stranica: number, sortiraj: string, datumOd: string, datumDo: string, vrijemeOd: string, vrijemeDo: string){
    let jwt = await this.autorizacijaServis.dajJwt();
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    if (jwt) {
      headers.set("Authorization", jwt);
    }
    let url = `baza/dnevnik?stranica=${stranica}&sortiraj=${sortiraj}`;

    if (datumOd) {
      url += `&datumOd=${datumOd}`;
    }

    if (datumDo) {
      url += `&datumDo=${datumDo}`;
    }

    if (vrijemeOd) {
      url += `&vrijemeOd=${vrijemeOd}`;
    }

    if (vrijemeDo) {
      url += `&vrijemeDo=${vrijemeDo}`;
    }

    let odgovor = await fetch(this.restServis + url, {
      method: "GET",
      headers: headers,
    });

    if(odgovor.status == 200){
      let zapisi = await odgovor.json();
      return zapisi;
    }
    throw new Error("Greška prilikom dohvaćanja zapisa.");
  }
}
