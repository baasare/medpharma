import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {User} from "../../models/user.model";
import {environment} from "../../../environments/environment";
import {TokenService} from "../../services/auth/token.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuItems!: any[];

  user!: User;

  constructor(
    private authService: AuthService,
    private localStore: LocalStorageService,
    private tokenStore: TokenService
  ) {
  }

  ngOnInit() {
    this.user = JSON.parse(this.localStore.getData(environment.user_profile));
  }

  logoutUser() {
    this.authService.logout();
    this.tokenStore.removeToken();
  }
}
