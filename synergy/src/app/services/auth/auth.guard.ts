import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {TokenService} from './token.service';
import {User} from '../../models/user.model';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user!: User;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private localStore: LocalStorageService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn = this.tokenService.getAccessToken();

    if (isLoggedIn) {
      return true;
    } else {
      return this.router.navigate(['/login']);
    }
  }
}
