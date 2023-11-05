import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LocalStorageService} from 'src/app/services/local-storage/local-storage.service';
import {User} from 'src/app/models/user.model';
import {environment} from 'src/environments/environment';

export class RoleGuard {

  static forRoles(...roles: String[]) {

    @Injectable({
      providedIn: 'root'
    })
    class RoleCheck implements CanActivate {
      user: User;

      constructor(
        private router: Router,
        private localStore: LocalStorageService
      ) {
        this.user = JSON.parse(this.localStore.getData(environment.user_profile));
      }

      canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        const userRole = this.user.user_type;

        if (roles.includes(userRole)) {
          return true;
        } else {
          return this.router.navigate(['/']);
        }
      }
    }

    return RoleCheck;
  }
}
