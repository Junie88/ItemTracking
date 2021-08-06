import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverduePage } from './overdue.page';

const routes: Routes = [
  {
    path: '',
    component: OverduePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverduePageRoutingModule {}
