import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutorizacijaService } from '../../servisi/autorizacija.service';
import { KorisnikI } from '../../servisi/KorisnikI';
import { GithubService } from '../../servisi/github.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss'
})
export class PrijavaComponent implements OnInit {

  prijavaForm: FormGroup = new FormGroup({});
  totpPrijava = false;

  constructor(private fb: FormBuilder, private router: Router, private autorizacijaServis: AutorizacijaService, private githubService: GithubService) {}

  ngOnInit() {
    this.prijavaForm = this.fb.group({
      korime: ['', Validators.required],
      lozinka: ['', Validators.required],
      totpKod: ['']
    });
  }

  async onSubmit() {
    console.log("U formi smo za prijavu");
    Object.keys(this.prijavaForm.controls).forEach(key => {
      const control = this.prijavaForm.get(key);

      if (control && control.invalid) {
        console.log(`Control ${key} is invalid. Errors:`, control.errors);
      }
    });

    if (this.prijavaForm.valid) {
      let podaci = this.prijavaForm.value;
      let odgovor = await this.autorizacijaServis.prijaviSe({korime: podaci.korime, lozinka: podaci.lozinka}, podaci.totpKod);

      if(odgovor == 2){
        this.totpPrijava = true;
      }else if (odgovor == 1) {
        let putanja = this.autorizacijaServis.dajUrlPokusajPristupa();
        this.autorizacijaServis.azurirajUrlPokusajPristupa("/");

        let url = putanja.split('?')[0];
        let parametri = this.izvuciParametre(putanja);
        this.router.navigate( [url], {queryParams: parametri});
      } else {
        console.log('Prijava neuspješna!');
      }
    } else {
      console.log('Form is invalid');
    }
  }

  async GithubPrijava(){
    await this.githubService.githubPrijava();
  }

  izvuciParametre(url: string): { [key: string]: string } {
    let parametriTekst = url.split('?')[1];
    let parametri: { [key: string]: string } = {};
  
    if (parametriTekst) {
      let parovi = parametriTekst.split('&');
  
      for (const par of parovi) {
        const [key, value] = par.split('=');
        parametri[key] = value;
      }
    }
  
    return parametri;
  }
}

