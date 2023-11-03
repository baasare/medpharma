import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {TokenService} from './token.service';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    const isLoggedIn = this.tokenService.getAccessToken();

    if (!isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/root']);
    }

    return false;
  }

}
