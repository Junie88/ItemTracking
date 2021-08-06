import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminConfigPage } from './admin-config.page';

const routes: Routes = [
  {
    path: '',
    component: AdminConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminConfigPageRoutingModule {}
