import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthLayoutRoutes} from './auth-layout.routing';
import {LoginComponent} from '../../pages/login/login.component';
import {RegistrationComponent} from "../../pages/registration/registration.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent,
    RegistrationComponent
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent
  ]
})
export class AuthLayoutModule {
}
