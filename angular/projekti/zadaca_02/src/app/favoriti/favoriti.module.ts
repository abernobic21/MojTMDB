import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritiRoutingModule } from './favoriti-routing.module';
import { FavoritiComponent } from './favoriti/favoriti.component';
import { FavoritiDetaljiComponent } from './favoriti-detalji/favoriti-detalji.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [FavoritiComponent, FavoritiDetaljiComponent],
  imports: [
    CommonModule,
    FavoritiRoutingModule,
    SharedModule
  ]
})
export class FavoritiModule { }
