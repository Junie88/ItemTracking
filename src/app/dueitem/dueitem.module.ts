import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DueitemPageRoutingModule } from './dueitem-routing.module';

import { DueitemPage } from './dueitem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DueitemPageRoutingModule
  ],
  declarations: [DueitemPage]
})
export class DueitemPageModule {}
