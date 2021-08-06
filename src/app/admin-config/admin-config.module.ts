import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AdminConfigPageRoutingModule } from './admin-config-routing.module';

import { AdminConfigPage } from './admin-config.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminConfigPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdminConfigPage]
})
export class AdminConfigPageModule {}
