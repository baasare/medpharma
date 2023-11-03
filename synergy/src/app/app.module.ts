import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ComponentsModule} from "./components/components.module";
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";
import {AdminLayoutComponent} from "./layout/admin-layout/admin-layout.component";
import {AuthService} from "./services/auth/auth.service";
import {AuthGuard} from "./services/auth/auth.guard";
import {LoginGuard} from "./services/auth/login.guard";
import {RoleGuard} from "./services/auth/role.guard";
import {AuthInterceptor} from "./services/auth/auth.interceptor";
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {CommonModule, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {BnNgIdleService} from 'bn-ng-idle';
import {AuditLogService} from "./services/audit-log/audit-log.service";
import {UserService} from "./services/user/user.service";

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoginGuard,
    RoleGuard,
    AuditLogService,
    UserService,
    BnNgIdleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
