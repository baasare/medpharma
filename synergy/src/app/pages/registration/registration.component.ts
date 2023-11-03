import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TokenModel} from 'src/app/models/auth.model';
import {AuthService} from 'src/app/services/auth/auth.service';
import {TokenService} from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();

  registrationForm: FormGroup = new FormGroup({
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
    this.registrationForm = this.formBuilder.group(
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

  RegisterUser() {
    this.authService.signup(this.registrationForm.value).subscribe({
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
