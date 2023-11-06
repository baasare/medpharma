import {Component, OnInit} from '@angular/core';
import {ConsultationService} from "../../services/consultation/consultation.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs";
import {Consultation} from "../../models/consultation.model";
import {DatePipe} from "@angular/common";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-consultations-details',
  templateUrl: './consultations-details.component.html',
  styleUrls: ['./consultations-details.component.scss']
})
export class ConsultationsDetailsComponent implements OnInit {

  constructor(
    private consultationService: ConsultationService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
  ) {
  }

  public id!: string;
  public isAddMode!: boolean;
  private datePipe = new DatePipe('en-US');
  allPatients!: User[];

  quillConfiguration = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      [{color: []}, {background: []}],
      ['link'],
      ['clean'],
    ],
  }

  consultationForm: FormGroup = new FormGroup({
    patient: new FormControl(''),
    consultation_type: new FormControl(''),
    healthcare_provider: new FormControl(''),
    status: new FormControl(''),
    condition: new FormControl(''),
    date: new FormControl(''),
    notes: new FormControl(''),
    medication: new FormControl(''),
  });

  ngOnInit(): void {
    this.fetchPatients();
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;


    this.consultationForm = this.formBuilder.group(
      {
        patient: ['', [Validators.required]],
        consultation_type: ['', [Validators.required]],
        healthcare_provider: ['', [Validators.required]],
        status: ['', [Validators.required]],
        condition: ['', [Validators.required]],
        date: ['', [Validators.required]],
        notes: ['', [Validators.required]],
        medication: ['', [Validators.required]]
      },
    );

    if (!this.isAddMode) {
      this.consultationService.getConsultation(this.id.trim())
        .pipe(first())
        .subscribe(x => {
          this.consultationForm.patchValue(x);
          this.consultationForm.controls['date'].setValue(new Date(x['date']).toISOString().slice(0, 16));
          this.consultationForm.controls['patient'].setValue(x['patient']['id']);
        });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.consultationForm.controls;
  }

  fetchPatients() {
    this.userService.getPatients().subscribe({
      next: (users: User[]) => {
        this.allPatients = users;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  saveConsultation() {
    if (this.isAddMode) {

      const formattedDate = `${this.consultationForm.get('date')?.value}T${this.consultationForm.get('time')?.value}.000Z`;
      this.consultationForm.get('date')?.patchValue(formattedDate);
      this.consultationService.addConsultation(this.consultationForm.value)
        .subscribe({
          next: (consultation: Consultation) => {
            // this.notifyService.showNotification('success', 'Consultations Added');
            console.log("Consultation Created");
            this.router.navigate(['/']);
          },
          error: err => {
            console.log(err);
          }
        });
    } else {
      this.consultationService.updateConsultation(this.consultationForm.value, this.id)
        .subscribe({
          next: () => {
            // this.notifyService.showNotification('success', 'Consultations Updated');
            this.router.navigate(['/']);
          },
          error: err => {
            console.log(err);
          }
        });
    }
  }

}
