import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AutorizacijaService } from './autorizacija.service';
import { SerijaTmdbDetaljiI } from './SerijeTmdbI';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  restServis = environment.restServis;

  favoriti = new Array<SerijaTmdbDetaljiI>();

  korime : string = "";

  constructor( private autorizacijaServis: AutorizacijaService ) {}

  async githubPrijava(){
    let odgovor = await fetch(this.restServis + "githubPrijava");
    console.log(odgovor);
    let githubUrl : string = await odgovor.json();
    console.log(githubUrl);
    window.location.href = githubUrl;
  }

  async githubProvjera(){
    let odgovor = await fetch(this.restServis + "githubProvjera");

    if(odgovor.status == 200){
      let podaci = await odgovor.json();
      this.autorizacijaServis.statusPrijaveSubject.next('github');
      this.autorizacijaServis.azurirajStatusPrijave('github');
      sessionStorage.setItem('korime', podaci.login);
      sessionStorage.setItem('statusPrijave', "github");

      return true;

    }else{
      console.log("Neuspješna prijava putem githuba!");
      return false;
    } 
  }

  async githubOdjava(){
    sessionStorage.setItem('korime', "");
    sessionStorage.setItem('statusPrijave', "");
    this.autorizacijaServis.statusPrijaveSubject.next("");
    await fetch(this.restServis + "githubOdjava");
  }

  dodajFavorita(serija?: SerijaTmdbDetaljiI) : boolean{
    this.dohvatiKorime();

    if(serija != null){
      for(let f of this.favoriti){
          if(f.id == serija.id){
            console.log("Serija već postoji u favoritima");
            return true;
          }
      }
      
      this.favoriti.push(serija);

      localStorage.setItem(this.korime, JSON.stringify(this.favoriti));
      return true;
    }else{
      return false;
    }
  } 

  dohvatiFavorite(){
    this.dohvatiKorime();

console.log("dohvati favorite", this.korime);
    let favoritiStorage = localStorage.getItem(this.korime);
      if(favoritiStorage != null){
        this.favoriti = JSON.parse(favoritiStorage);
      }
  }

  dajFavorite(): Array<SerijaTmdbDetaljiI> | null{
    console.log("dajem favorite");
    if(this.favoriti.length == 0)
      this.dohvatiFavorite();
    return this.favoriti;
  }

  dajFavorita(id: number) : SerijaTmdbDetaljiI | null{
    let favorit : SerijaTmdbDetaljiI | null = null;

    if(this.favoriti.length == 0)
      this.dohvatiFavorite();

    if(this.favoriti != null){
      for(let f of this.favoriti){
        if(f.id == id){
          favorit = f;
          break;
        }
      }
    }
    return favorit;
  }

  dohvatiKorime(){
    let korime = sessionStorage.getItem("korime");

    if(korime == null){
      this.korime = "";
    }else{
      this.korime = korime;
    }
  }
}
