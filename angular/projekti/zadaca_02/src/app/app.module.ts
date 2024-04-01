import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { SerijaDetaljiComponent} from './serija-detalji/serija-detalji.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { AutorizacijaModule } from './autorizacija/autorizacija.module';
import { FavoritiModule } from './favoriti/favoriti.module';
import { KorisniciModule } from './korisnici/korisnici.module'
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { DnevnikComponent } from './dnevnik/dnevnik.component';

const routes: Routes = [
  { path: 'pocetna', component: PocetnaComponent },
  { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
  {path: 'serijaDetalji', component: SerijaDetaljiComponent},
  {path: 'dokumentacija', component: DokumentacijaComponent},
  {path: 'dnevnik', component: DnevnikComponent}
];

@NgModule({
  declarations: [AppComponent, PocetnaComponent, SerijaDetaljiComponent, DokumentacijaComponent, DnevnikComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), AutorizacijaModule, FavoritiModule, KorisniciModule, SharedModule],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
