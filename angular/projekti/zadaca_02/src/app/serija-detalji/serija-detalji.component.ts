import { Component } from '@angular/core';
import { SerijaTmdbDetaljiI } from '../servisi/SerijeTmdbI';
import { SerijeService } from '../servisi/serije.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DatePipe, Location } from '@angular/common';
import { GithubService } from '../servisi/github.service';
import { AutorizacijaService } from '../servisi/autorizacija.service';

@Component({
  selector: 'app-serija-detalji',
  templateUrl: './serija-detalji.component.html',
  styleUrl: './serija-detalji.component.scss'
})
export class SerijaDetaljiComponent {

  statusPrijave = '';
  korisnkAutoriziran = false;

  posteriPutanja = environment.posteriPutanja;
  serija?: SerijaTmdbDetaljiI;
  id = 0;

  constructor(
    private serijeServis: SerijeService,
    private githubServis: GithubService,
    private autorizacijaServis: AutorizacijaService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private location: Location,
    private router: Router) {}

  async ngOnInit(){

    let statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();
    if(statusPrijave == "" || statusPrijave == null){
      let trenutniUrl = this.location.path();
      this.autorizacijaServis.azurirajUrlPokusajPristupa(trenutniUrl);
      this.router.navigate(['/prijava']);
    }

    this.route.queryParams.subscribe(params =>{
      this.id = params['id'];
    })

    await this.ucitajSeriju();

    this.statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();
  }

  private async ucitajSeriju(){
      this.serija = await this.serijeServis.dajSeriju(this.id);
  }

  async dodajFavorita(serija?: SerijaTmdbDetaljiI){
  console.log("status prijave u serije detalji je", this.statusPrijave);
    let odgovor : boolean;
    if(this.statusPrijave == 'github'){
      odgovor = this.githubServis.dodajFavorita(serija);
    }else{
      odgovor = await this.serijeServis.dodajFavorita(serija);
    }
    if(odgovor){
      window.alert("Serija uspješno dodana na popis favorita.");
    }else{
      window.alert("Greška pri dodavanju na popis favorita.");
    }

  }
}
