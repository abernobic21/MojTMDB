import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritiComponent } from './favoriti/favoriti.component';
import { FavoritiDetaljiComponent } from './favoriti-detalji/favoriti-detalji.component';

const routes: Routes = [
  {path: 'favoriti', component: FavoritiComponent},
  {path: 'favoritiDetalji', component: FavoritiDetaljiComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritiRoutingModule { }
