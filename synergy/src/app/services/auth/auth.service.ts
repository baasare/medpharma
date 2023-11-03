import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LoginModel} from 'src/app/models/auth.model';
import {NewUser, User} from 'src/app/models/user.model';
import {environment} from 'src/environments/environment';
import {TokenService} from './token.service';
import {LocalStorageService} from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService,
    private localStore: LocalStorageService
  ) {
  }

  login(user: LoginModel) {
    return this.http
      .post<any>(`${environment.api_backend}/account/login`, user);
  }

  signup(newUser: NewUser) {
    return this.http
      .post<any>(`${environment.api_backend}/account/register`, newUser);
  }


  logout() {
    return this.http
      .post<any>(`${environment.api_backend}/account/logout`, {'refresh': this.tokenService.getRefreshToken()})
      .subscribe({
        next: () => {
          this.localStore.clearData();
          sessionStorage.clear();
          this.router.navigate(['login/']);
        },
        error: err => {
          console.log('ERROR: ' + err);
        }
      });
  }

  profile() {
    return this.http
      .get<any>(`${environment.api_backend}/account/profile`)
      .subscribe({
        next: (user: User) => {
          this.localStore.saveData(environment.user_profile, JSON.stringify(user));
          this.router.navigate(['/root']);
        },
        error: err => {
          console.log(err);
        }
      });
  }

  refreshToken() {
    return this.http
      .post<any>(`${environment.api_backend}/account/refresh`, {'refresh': this.tokenService.getRefreshToken()});
  }

  passwordChangeRequest(email: string) {
    return this.http
      .post<any>(`${environment.api_backend}/account/password_change_request`, email);
  }

  passwordChangeConfirm(uid_64: string, token: string, password: string) {
    return this.http
      .post<any>(`${environment.api_backend}/account/password_change_confirm`, {
        'uid_64': uid_64,
        'token': token,
        'password': password
      });
  }

  passwordChange(password: any) {
    return this.http
      .post<any>(`${environment.api_backend}/account/password_change`, password);
  }

}
