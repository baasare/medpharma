import {Routes} from '@angular/router';
import {UsersComponent} from "../../pages/users/users.component";
import {UserProfileComponent} from "../../pages/user-profile/user-profile.component";
import {RoleGuard} from "../../services/auth/role.guard";
import {ConsultationsComponent} from "../../pages/consultations/consultations.component";
import {ConsultationsDetailsComponent} from "../../pages/consultations-details/consultations-details.component";

export const AdminLayoutRoutes: Routes = [
  {
    path: '',
    component: ConsultationsComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [RoleGuard.forRoles('admin', 'super_admin')],
  },
  {
    path: 'users/add',
    component: UserProfileComponent,
    canActivate: [RoleGuard.forRoles('admin', 'super_admin')],
  },
  {
    path: 'users/edit/:id',
    component: UserProfileComponent,
    canActivate: [RoleGuard.forRoles('admin', 'super_admin')],
  },
  {
    path: 'consultations',
    component: ConsultationsComponent,
  },
  {
    path: 'consultations/add',
    component: ConsultationsDetailsComponent,
    // canActivate: [RoleGuard.forRoles('admin', 'super_admin', 'officer')],
  },
  {
    path: 'consultations/edit/:id',
    component: ConsultationsDetailsComponent,
    // canActivate: [RoleGuard.forRoles('admin', 'super_admin', 'officer')],
  },
];
