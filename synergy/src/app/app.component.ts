import Swal from 'sweetalert2';
import {Component} from '@angular/core';
import {BnNgIdleService} from "bn-ng-idle";
import {AuthService} from "./services/auth/auth.service";
import {TokenService} from "./services/auth/token.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'synergy';

  constructor(
    private bnIdle: BnNgIdleService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {
  }


  ngOnInit(): void {
    this.bnIdle.startWatching(300).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        const isLoggedIn = this.tokenService.getAccessToken();
        if (isLoggedIn) {
          this.confirmLogout();
        }
      }
    });
  }

  confirmLogout() {
    Swal.fire({
      title: 'You will be logged out soon',
      icon: 'warning',
      timer: 10000, // milliseconds
      timerProgressBar: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, logout.',
      cancelButtonText: 'Cancel',
      customClass: 'swal-wide',
    }).then((result) => {
      if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
        this.authService.logout();
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been logged out',
          icon: 'success',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', '', 'error');
      }
    });
  }


}
