import { Component } from '@angular/core';
import { SerijaTmdbDetaljiI } from '../../servisi/SerijeTmdbI';
import { SerijeService } from '../../servisi/serije.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { GithubService } from '../../servisi/github.service';
import { AutorizacijaService } from '../../servisi/autorizacija.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-favoriti',
  templateUrl: './favoriti.component.html',
  styleUrl: './favoriti.component.scss'
})
export class FavoritiComponent {
  
  statusPrijave = '';
  korisnikAutoriziran = false;

  posteriPutanja = environment.posteriPutanja;
  serije = new Array<SerijaTmdbDetaljiI>;

  constructor(
    private serijeServis: SerijeService,
    private githubServis: GithubService,
    private autorizacijaServis: AutorizacijaService,
    private router: Router,
    private location: Location){}

  async ngOnInit(){
 
    this.statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();

    if(this.statusPrijave == "" || this.statusPrijave == null){
      let trenutniUrl = this.location.path();
      this.autorizacijaServis.azurirajUrlPokusajPristupa(trenutniUrl);
      this.router.navigate(['/prijava']);
    }else{
      this.korisnikAutoriziran = true;

      if(this.statusPrijave == 'github'){
      let serije = this.githubServis.dajFavorite();
      if(serije != null)
        this.serije = serije;
      }else{
        this.serije = await this.serijeServis.dajFavorite();
      }
    }
  }

  otvoriFavoritiDetalji(id: number) {
    this.router.navigate(['/favoritiDetalji'], { queryParams: { id: id.toString() } });
  }
}
