import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KorisniciRoutingModule } from './korisnici-routing.module';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { ProfilComponent } from './profil/profil.component';
import { ReactiveFormsModule } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';
import { ZabranaPristupaComponent } from '../zabrana-pristupa/zabrana-pristupa.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [KorisniciComponent, ProfilComponent],
  imports: [
    CommonModule,
    KorisniciRoutingModule,
    ReactiveFormsModule,
    QRCodeModule,
    SharedModule
  ]
})
export class KorisniciModule { }
