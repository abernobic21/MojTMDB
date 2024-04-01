import { Component } from '@angular/core';
import { SerijeService } from '../servisi/serije.service';
import { Router } from '@angular/router';
import { SerijaTmdbI, SerijeTmdbI } from '../servisi/SerijeTmdbI';
import { environment } from '../../environments/environment';
import { AutorizacijaService } from '../servisi/autorizacija.service';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.scss'
})
export class PocetnaComponent {
 
  posteriPutanja = environment.posteriPutanja;
  podaciSerija?:SerijeTmdbI | null;

  filter = '';
  korisnikAutoriziran = true;

  constructor(private serijeServis: SerijeService, private router:Router, private autorizacijaServis: AutorizacijaService) {}

  ngOnInit(){
    this.podaciSerija = null;
  }

  async filtriraj() {
    if(this.filter.length >= 3){
      this.dajSerije(1);
    }else{
      this.podaciSerija = null;
    }
  }

  async dajSerije(stranica: number){
    try{
      this.podaciSerija = await this.serijeServis.dajSerije(stranica, this.filter);
      this.korisnikAutoriziran = true;
    }catch{
      this.korisnikAutoriziran = false;
    }    
  }

  otvoriSerijaDetalji(id : number){
    this.router.navigate(['/serijaDetalji'], { queryParams: { id: id.toString() } });
  }
}
