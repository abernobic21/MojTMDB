import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ZabranaPristupaComponent } from '../zabrana-pristupa/zabrana-pristupa.component';


@NgModule({
  declarations: [
    ZabranaPristupaComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    ZabranaPristupaComponent
  ]
})
export class SharedModule { }
