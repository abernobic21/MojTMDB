import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import {GithubPocetnaComponent} from './github-pocetna/github-pocetna.component'

const routes: Routes = [
  {path: 'registracija', component: RegistracijaComponent },
  {path: 'prijava', component: PrijavaComponent },
  {path: 'githubPocetna', component: GithubPocetnaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizacijaRoutingModule { }
