import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';


import {AuthGuard} from './services/auth/auth.guard';
import {LoginGuard} from './services/auth/login.guard';
import {AdminLayoutComponent} from "./layout/admin-layout/admin-layout.component";
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'root',
    pathMatch: 'full',
  }, {
    path: '',
    canActivate: [AuthGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layout/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layout/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  }, {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false,
    })
  ],
  exports: [],
})
export class AppRoutingModule {
}
