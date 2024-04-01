import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AutorizacijaRoutingModule } from './autorizacija-routing.module';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import {GithubPocetnaComponent} from './github-pocetna/github-pocetna.component'
import { SharedModule } from '../shared/shared.module';


@NgModule({
    declarations: [RegistracijaComponent, PrijavaComponent, GithubPocetnaComponent],
    imports: [
        CommonModule,
        AutorizacijaRoutingModule,
        ReactiveFormsModule,
        SharedModule
        ]
})
export class AutorizacijaModule { }
