import {Component, OnInit} from '@angular/core';
import {ConsultationService} from "../../services/consultation/consultation.service";
import {UserService} from "../../services/user/user.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    constructor(
        // private notifyService: NotificationService,
        private consultationService: ConsultationService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
    ) {
    }

    public id!: string;
    public isAddMode!: boolean;


    userForm: FormGroup = new FormGroup({
        email: new FormControl(''),
        first_name: new FormControl(''),
        last_name: new FormControl(''),
        phone_number: new FormControl(''),
        user_type: new FormControl(''),
        password: new FormControl(''),
        confirm_password: new FormControl(''),
    });

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.userForm = this.formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                first_name: ['', [Validators.required, Validators.minLength(6)]],
                last_name: ['', [Validators.required, Validators.minLength(6)]],
                phone_number: ['', [Validators.required]],
                user_type: ['', [Validators.required]],
                password: ['', [Validators.minLength(8), this.isAddMode ? Validators.required : Validators.nullValidator]],
                confirm_password: ['', [this.isAddMode ? Validators.required : Validators.nullValidator]],
            },
            {
                validators: this.mustMatch('password', 'confirm_password')
            }
        );

        if (!this.isAddMode) {
            this.userService.getUser(this.id.trim())
                .pipe(first())
                .subscribe(x => this.userForm.patchValue(x));
        }
    }

    get f(): { [key: string]: AbstractControl } {
        return this.userForm.controls;
    }

    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                return;
            }

            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({mustMatch: true});
            } else {
                matchingControl.setErrors(null);
            }
            return null;
        };
    }


    saveUser() {
        if (this.isAddMode) {
            this.userService.addUser(this.userForm.value)
                .subscribe({
                    next: () => {
                        // this.notifyService.showNotification('success', 'User Added');
                        this.router.navigate(['users/']);
                    },
                    error: err => {
                        console.log(err);
                    }
                });
        } else {
            const tempForm = this.userForm.value;
            if (this.userForm.controls['password'].value === '') {
                delete tempForm['password'];
            }
            this.userService.updateUser(tempForm, this.id)
                .subscribe({
                    next: () => {
                        // this.notifyService.showNotification('success', 'User Updated');
                        this.router.navigate(['users/']);
                    },
                    error: err => {
                        console.log(err);
                    }
                });
        }
    }
}
