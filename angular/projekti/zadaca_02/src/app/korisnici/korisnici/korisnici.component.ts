import { Component } from '@angular/core';
import { KorisnikI } from '../../servisi/KorisnikI';
import { KorisniciService } from '../../servisi/korisnici.service';
import { AutorizacijaService } from '../../servisi/autorizacija.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrl: './korisnici.component.scss'
})
export class KorisniciComponent {
  korisnici = new Array<KorisnikI>;

  korisnikAutoriziran = false;

  constructor(
    private korisniciServis: KorisniciService,
    private autorizacijaServis: AutorizacijaService,
    private router: Router,
    private location: Location){};

  async ngOnInit(){

    let statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();
    if(statusPrijave == "" || statusPrijave == null){
      let trenutniUrl = this.location.path();
      this.autorizacijaServis.azurirajUrlPokusajPristupa(trenutniUrl);
      this.router.navigate(['/prijava']);
    }else if(statusPrijave != "admin"){
      this.korisnikAutoriziran = false;
    }else{
      this.korisnikAutoriziran = true;
    }

    await this.dajKorisnike();
  }

  async dajKorisnike(){
    this.korisnici = await this.korisniciServis.dajKorisnike();
  } 

  async obrisiKorisnika(korime: string){
    await this.korisniciServis.obrisiKorisnika(korime);
    await this.dajKorisnike();
  }

}
