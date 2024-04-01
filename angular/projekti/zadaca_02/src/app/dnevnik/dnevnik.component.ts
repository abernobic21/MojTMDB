import { Component } from '@angular/core';
import { AutorizacijaService } from '../servisi/autorizacija.service';
import { DnevnikService } from '../servisi/dnevnik.service'
import { ZapisI } from '../servisi/ZapisI';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dnevnik',
  templateUrl: './dnevnik.component.html',
  styleUrl: './dnevnik.component.scss'
})
export class DnevnikComponent {

  zapisi = new Array<ZapisI>();

  stranica = 0;
  datumOd = '';
  datumDo = '';
  vrijemeOd = '';
  vrijemeDo = '';
  sort = 'd';
  ukupnoStranica = 0;

  korisnikAutoriziran = false;

  constructor( 
    private autorizacijaServis: AutorizacijaService, 
    private dnevnikServis: DnevnikService, 
    private router: Router,
    private location: Location ){}

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
  } 

  promjeniSort(sort: string){
    this.sort = sort;
  }
  
  async dajZapise(stranica: number = this.stranica, sortiraj: string = this.sort, datumOd: string = this.datumOd, datumDo: string = this.datumDo, vrijemeOd: string = this.vrijemeOd, vrijemeDo: string = this.vrijemeDo){
    let odgovor = await this.dnevnikServis.dajZapise(stranica, sortiraj, datumOd, datumDo, vrijemeOd, vrijemeDo);
    console.log(odgovor);
    this.zapisi = odgovor.podaci;
    this.ukupnoStranica = odgovor.brojZapisa;
    this.stranica = stranica;
  }
} 


