import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from "./admin-layout.routing";
import {ComponentsModule} from "../../components/components.module";
import {UsersComponent} from "../../pages/users/users.component";
import {UserProfileComponent} from "../../pages/user-profile/user-profile.component";
import {DataTablesModule} from 'angular-datatables';
import {ConsultationsComponent} from "../../pages/consultations/consultations.component";
import {ConsultationsDetailsComponent} from "../../pages/consultations-details/consultations-details.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ComponentsModule,
    DataTablesModule
  ],
  declarations: [
    UsersComponent,
    UserProfileComponent,
    ConsultationsComponent,
    ConsultationsDetailsComponent
  ],
})

export class AdminLayoutModule {
}
