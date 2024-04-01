import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KorisniciService } from '../../servisi/korisnici.service';
import { AutorizacijaService } from '../../servisi/autorizacija.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss'
})
export class RegistracijaComponent implements OnInit {
  registracijaForm: FormGroup = new FormGroup({});
  korisnikAutoriziran = false;

  constructor(
    private koriniciServis: KorisniciService,
    private fb: FormBuilder,
    private korisniciServis: KorisniciService,
    private autorizacijaServis: AutorizacijaService,
    private router: Router,
    private location: Location){};

  async ngOnInit(){

    let statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();
    console.log("registraija", statusPrijave);
    if(statusPrijave == "" || statusPrijave == null){
      let trenutniUrl = this.location.path();
      this.autorizacijaServis.azurirajUrlPokusajPristupa(trenutniUrl);
      this.router.navigate(['/prijava']);
    }else if(statusPrijave != "admin"){
      this.korisnikAutoriziran = false;
    }else{
      this.korisnikAutoriziran = true;
    }

    this.registracijaForm = this.fb.group({
      korime: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
      lozinka: ['', Validators.required],
      ime: ['', [Validators.required, Validators.pattern(/^[a-zA-ZčćžšđČĆŽŠĐ\s]+$/)]],
      prezime: ['', [Validators.required, Validators.pattern(/^[a-zA-ZčćžšđČĆŽŠĐ\s]+$/)]],
      adresa: [''],
      datumRodenja: ['', Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/)],
      telefon: ['', Validators.pattern(/^(\+)?\d+$/)],
    });
  }

  async onSubmit(){
    Object.keys(this.registracijaForm.controls).forEach(key => {
      const control = this.registracijaForm.get(key);

      if (control && control.invalid) {
        console.log(`Control ${key} is invalid. Errors:`, control.errors);
      }
    });
    if (this.registracijaForm.valid) {
      let uspjesno = await this.koriniciServis.dodajKorisnika(this.registracijaForm.value);

      if(uspjesno){
        window.alert("Korisnik dodan.");
        this.registracijaForm.reset();
      }else{
        window.alert("Greška pri dodavanju korisnika");
      }

    }else{
      window.alert("Podaci nisu ispravni, provjerite podatke i pokušajte ponovno.");
    }
  }
}
