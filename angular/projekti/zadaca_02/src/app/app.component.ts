import { Component } from '@angular/core';
import { AutorizacijaService } from './servisi/autorizacija.service';
import { Router } from '@angular/router';
import { GithubService } from './servisi/github.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mojTMDB';
  putanja = 'pocetna';
  
  statusPrijave : string = "";

  constructor(private autorizacijaServis: AutorizacijaService, private githubServis: GithubService,private router: Router){}

  ngOnInit() {
    this.autorizacijaServis.dajStatusPrijave().subscribe((statusPrijave: string) => {
      console.log("observable", statusPrijave);
      this.statusPrijave = statusPrijave;
    })
    if(this.statusPrijave == ""){
      let statusPrijave = sessionStorage.getItem("statusPrijave");
      console.log("status prijave citam",statusPrijave);
      this.statusPrijave = statusPrijave ? statusPrijave : "";
    }
    this.autorizacijaServis.azurirajStatusPrijave(this.statusPrijave);
  }

  async odjaviSe() {
    if(this.statusPrijave == "github"){
      await this.githubServis.githubOdjava();
    }else{
      this.autorizacijaServis.odjaviSe();
    }
    this.router.navigate(['/']);
  }
}
 