import { Component } from '@angular/core';
import { GithubService } from '../../servisi/github.service';
import { AutorizacijaService } from '../../servisi/autorizacija.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-github-pocetna',
  templateUrl: './github-pocetna.component.html',
  styleUrl: './github-pocetna.component.scss'
})
export class GithubPocetnaComponent {

  uspjeh : boolean = false;

  korisnikAutoriziran : boolean = true;

  constructor(private githubServis: GithubService, private autorizacijaServis: AutorizacijaService, private router: Router, private location: Location){}
  
  async ngOnInit(){
    this.uspjeh = await this.githubServis.githubProvjera();

    let statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();
    if(statusPrijave == "" || statusPrijave == null){
      let trenutniUrl = this.location.path();
      this.autorizacijaServis.azurirajUrlPokusajPristupa(trenutniUrl);
      this.router.navigate(['/prijava']);
    }else if(statusPrijave == "github"){
      this.korisnikAutoriziran = true;
    }else{
      this.korisnikAutoriziran = false;
    }
  }
}
