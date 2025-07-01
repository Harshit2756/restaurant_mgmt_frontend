import { Routes } from '@angular/router';
import { AddMenuComponent } from './pages/add-menu/add-menu.component';
import { HomeComponent } from './pages/home/home.component';
import { UpdateMenuComponent } from './pages/update-menu/update-menu.component';
import { ViewMenuComponent } from './pages/view-menu/view-menu.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-menu', component: AddMenuComponent },
  { path: 'view-menu', component: ViewMenuComponent },
  { path: 'update-menu/:id', component: UpdateMenuComponent },
  { path: '**', redirectTo: '' },
];
