import { Component } from '@angular/core';
import { SerijaTmdbDetaljiI } from '../../servisi/SerijeTmdbI';
import { SerijeService } from '../../servisi/serije.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AutorizacijaService } from '../../servisi/autorizacija.service';
import { GithubService } from '../../servisi/github.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-favoriti-detalji',
  templateUrl: './favoriti-detalji.component.html',
  styleUrl: './favoriti-detalji.component.scss'
})
export class FavoritiDetaljiComponent {

  statusPrijave = '';
  korisnikAutoriziran = false;

  posteriPutanja = environment.posteriPutanja;
  serija: SerijaTmdbDetaljiI | null = null;
  id = 0;

  constructor(
    private serijeServis: SerijeService,
    private githubServis: GithubService,
    private autorizacijaServis: AutorizacijaService,
    private route: ActivatedRoute,
    private router:Router,
    private location: Location
    ) {}

  async ngOnInit(){
    this.statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();
    this.route.queryParams.subscribe(params =>{
      this.id = params['id'];
      console.log(this.id);
    })

    if(this.statusPrijave == "" || this.statusPrijave == null){
      let trenutniUrl = this.location.path();
      this.autorizacijaServis.azurirajUrlPokusajPristupa(trenutniUrl);
      this.router.navigate(['/prijava']);
    }else{
      this.korisnikAutoriziran = true;

      if(this.statusPrijave == 'github'){
        this.serija = this.githubServis.dajFavorita(this.id);
      }else{
        await this.ucitajFavorita();
      }
    }
  }

  private async ucitajFavorita(){
      this.serija = await this.serijeServis.dajFavorita(this.id);
  }
}
