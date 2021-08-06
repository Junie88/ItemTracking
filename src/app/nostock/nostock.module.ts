import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NostockPageRoutingModule } from './nostock-routing.module';

import { NostockPage } from './nostock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NostockPageRoutingModule
  ],
  declarations: [NostockPage]
})
export class NostockPageModule {}
