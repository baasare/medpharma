import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NewUser} from 'src/app/models/user.model';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  getUsers() {
    return this.http.get<any>(`${environment.api_backend}/account/users`);
  }

  getUser(id: string) {
    return this.http
      .get<any>(`${environment.api_backend}/account/users/${id}`);
  }

  addUser(user: NewUser) {
    return this.http
      .post<any>(`${environment.api_backend}/account/users`, user);
  }

  updateUser(user: {}, id: any) {
    return this.http
      .patch<any>(`${environment.api_backend}/account/users/${id}`, user);
  }

  removeUser(id: String) {
    return this.http
      .delete<any>(`${environment.api_backend}/account/users/${id}`);
  }
}
