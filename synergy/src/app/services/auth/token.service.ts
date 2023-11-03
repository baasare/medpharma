import {Injectable} from '@angular/core';
import {TokenModel} from 'src/app/models/auth.model';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }

  setAccessToken(accessToken: string) {
    sessionStorage.setItem(environment.access_token, accessToken);
  }

  setToken(token: TokenModel) {
    sessionStorage.setItem(environment.access_token, token.access);
    sessionStorage.setItem(environment.refresh_token, token.refresh);
  }

  getAccessToken() {
    return sessionStorage.getItem(environment.access_token);
  }

  getRefreshToken() {
    return sessionStorage.getItem(environment.refresh_token);
  }

  removeToken() {
    return sessionStorage.clear();
  }
}
