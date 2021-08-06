import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'admin-config',
    loadChildren: () => import('./admin-config/admin-config.module').then( m => m.AdminConfigPageModule)
  },
  {
    path: 'new-item',
    loadChildren: () => import('./new-item/new-item.module').then( m => m.NewItemPageModule)
  },
  {
    path: 'item-list',
    loadChildren: () => import('./item-list/item-list.module').then( m => m.ItemListPageModule)
  },
  {
    path: 'nostock',
    loadChildren: () => import('./nostock/nostock.module').then( m => m.NostockPageModule)
  },
  {
    path: 'overdue',
    loadChildren: () => import('./overdue/overdue.module').then( m => m.OverduePageModule)
  },
  {
    path: 'dueitem',
    loadChildren: () => import('./dueitem/dueitem.module').then( m => m.DueitemPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
