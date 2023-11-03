import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TokenModel} from 'src/app/models/auth.model';
import {AuthService} from 'src/app/services/auth/auth.service';
import {TokenService} from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitted = false;

  constructor(
    public router: Router,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    // private notifyService: NotificationService,
  ) {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [''],
      }
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  loginUser() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: TokenModel) => {
        this.tokenService.setToken(res);
        this.authService.profile();
      },
      error: err => {
        // this.notifyService.showNotification('danger', err.error.detail);
        console.log(err);
      }
    });
  }

}
