import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

declare var grecaptcha: any;

@Injectable({
  providedIn: 'root'
})
export class AutorizacijaService {

  restServis = environment.restServis;

  statusPrijaveSubject = new Subject<string>();
  statusPrijaveObservable = this.statusPrijaveSubject.asObservable();

  trenutniStatusPrijave : string = "";
  urlPokusajPristupa : string = "/";

  constructor() { }

  async prijaviSe(korisnik: {korime: string, lozinka: string}, totpKod: string) : Promise<number>{
    return new Promise<number>((uspjeh) => {
      grecaptcha.ready(() => {
        console.log("ready");
        grecaptcha.execute('6LcheUIpAAAAAJbWd56D-OgAqYPeL_XbY16sXFN7', { action: 'prijava' }).then(async (token: string) => {
          const odgovor = await this.Prijava(korisnik, totpKod, token);
          uspjeh(odgovor);
        });
      });
    });
  }
    
  async Prijava(korisnik: {korime: string, lozinka: string}, totpKod: string,token: string) : Promise<number>{
    
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    const odgovor = await fetch(this.restServis + "baza/korisnici/" + korisnik.korime +"/prijava", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({korime: korisnik.korime, lozinka: korisnik.lozinka, totpKod: totpKod, token: token}),
      });

      if (odgovor.status === 201) {

        sessionStorage.setItem('korime', korisnik.korime);
        sessionStorage.setItem('statusPrijave', korisnik.korime);
        this.statusPrijaveSubject.next(korisnik.korime);
        this.azurirajStatusPrijave(korisnik.korime);
        return 1;
      }else if(odgovor.status == 200){
        return 2;
      }else{
        return 0;
      }
    }

    odjaviSe(){
      sessionStorage.setItem('korime', "");
      sessionStorage.setItem('statusPrijave', "");
      this.statusPrijaveSubject.next("");
    }

    dajStatusPrijave(): Observable<string> {
      return this.statusPrijaveObservable;
    }

    async dajJwt(){
      let korime = sessionStorage.getItem('korime');
      let odgovor = await fetch(this.restServis + "baza/korisnici/" + korime + "/prijava");
      if(odgovor.ok){
        let jwtToken = odgovor.headers.get('Authorization')?.trim();
        console.log(jwtToken);
        return jwtToken;
      }else{
        return "";
      }
    }

    azurirajStatusPrijave(status: string){
      this.trenutniStatusPrijave = status;
    }

    dajTrenutniStatusPrijave(){
      return this.trenutniStatusPrijave;
    }

    azurirajUrlPokusajPristupa(url : string){
      this.urlPokusajPristupa = url;
    }

    dajUrlPokusajPristupa() : string{
      return this.urlPokusajPristupa;
    }

}
