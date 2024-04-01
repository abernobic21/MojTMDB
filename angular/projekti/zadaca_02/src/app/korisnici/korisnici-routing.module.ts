import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  {path: "korisnici", component: KorisniciComponent},
  {path:"profil", component: ProfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KorisniciRoutingModule { }
