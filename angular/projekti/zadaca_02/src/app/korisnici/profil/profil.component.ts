import { Component, OnInit } from '@angular/core';
import { KorisnikI } from '../../servisi/KorisnikI';
import { KorisniciService } from '../../servisi/korisnici.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutorizacijaService } from '../../servisi/autorizacija.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {
  profilForm: FormGroup = new FormGroup({});

  korisnikAutoriziran = false;
  korisnik?: KorisnikI;

  public totpKljuc: string = "";


  constructor(
    private korisniciServis: KorisniciService,
    private fb: FormBuilder,
    private autorizacijaServis: AutorizacijaService,
    private router: Router,
    private location: Location){
      this.totpKljuc = '';
  }

  async ngOnInit(){

    let statusPrijave = this.autorizacijaServis.dajTrenutniStatusPrijave();
    if(statusPrijave == "" || statusPrijave == null){
      let trenutniUrl = this.location.path();
      this.autorizacijaServis.azurirajUrlPokusajPristupa(trenutniUrl);
      this.router.navigate(['/prijava']);
    }else if(statusPrijave == "github"){
      this.korisnikAutoriziran = false;
    }else{
      this.korisnikAutoriziran = true;
    }

    this.profilForm = this.fb.group({
      korime: [{value: '', readonly: true}, Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
      lozinka: [''],
      ime: ['', [Validators.required, Validators.pattern(/^[a-zA-ZčćžšđČĆŽŠĐ\s]+$/)]],
      prezime: ['', [Validators.required, Validators.pattern(/^[a-zA-ZčćžšđČĆŽŠĐ\s]+$/)]],
      adresa: [''],
      datumRodenja: ['', Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/)],
      telefon: ['', Validators.pattern(/^(\+)?\d+$/)],
      totpAktivan: [false]
    });

    await this.dajKorisnika();

    this.popuniFormu();
  }

  async dajKorisnika(){
    this.korisnik = await this.korisniciServis.dajKorisnika();
    console.log(this.korisnik);
  }

  private popuniFormu(){
    if (this.korisnik) {
      this.profilForm.patchValue({
        korime: this.korisnik.korime,
        email: this.korisnik.email,
        lozinka: '',
        ime: this.korisnik.ime,
        prezime: this.korisnik.prezime,
        adresa: this.korisnik.adresa,
        datumRodenja: this.korisnik.datumRodenja,
        telefon: this.korisnik.telefon,
        totpAktivan: this.korisnik.totpAktivan,
      });
    }
  }

  async onSubmit(){
    if (this.profilForm.valid) {

      let odgovor = await this.korisniciServis.azurirajKorisnika(this.profilForm.value);
      await this.dajKorisnika();
      if(odgovor){
        window.alert("Podaci uspješno ažurirani.");
      }else{
        window.alert("Greška pri ažuriranju podataka.");
      }
      if(odgovor && !this.korisnik?.totp && this.profilForm.value.totpAktivan){
        this.totpKljuc = await this.korisniciServis.dodajTotpKljuc(this.profilForm.value.korime);
      }
    }else{
      window.alert("Podaci nisu ispravni, provjerite podatke i pokušajte ponovno.");
    }
  }
}