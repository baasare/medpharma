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
        first_name: new FormControl(''),
        last_name: new FormControl(''),
        phone_number: new FormControl(''),
        password: new FormControl(''),
        user_type: new FormControl(''),
    });

    submitted = false;

    constructor(
        public router: Router,
        public authService: AuthService,
        private formBuilder: FormBuilder,
        // private notifyService: NotificationService,
    ) {
        this.registrationForm = this.formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                first_name: ['', [Validators.required, Validators.minLength(2)]],
                last_name: ['', [Validators.required, Validators.minLength(2)]],
                phone_number: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                    Validators.minLength(10), Validators.maxLength(10)]],
                password: [''],
                user_type: ['', [Validators.required]],
            }
        );

    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    registerUser() {
        this.authService.signup(this.registrationForm.value).subscribe({
          next: (res: TokenModel) => {
            return this.router.navigate(['/login']);
          },
          error: err => {
            // this.notifyService.showNotification('danger', err.error.detail);
            console.log(err);
          }
        });
    }

}
