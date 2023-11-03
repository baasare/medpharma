import {Component, OnInit} from '@angular/core';
import {ConsultationService} from "../../services/consultation/consultation.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs";
import {Consultation} from "../../models/consultation.model";

@Component({
  selector: 'app-consultations-details',
  templateUrl: './consultations-details.component.html',
  styleUrls: ['./consultations-details.component.scss']
})
export class ConsultationsDetailsComponent implements OnInit {

  constructor(
    private consultationService: ConsultationService,
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
  ) {
  }

  public id!: string;
  public isAddMode!: boolean;

  consultationForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    fi_code: new FormControl(''),
    powercard_root_path: new FormControl(''),
    ezwich_root_path: new FormControl(''),
    ghanapay_root_path: new FormControl(''),
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;


    this.consultationForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        fi_code: ['', [Validators.required]],
        powercard_root_path: ['', [Validators.required]],
        ezwich_root_path: ['', [Validators.required]],
        ghanapay_root_path: ['', [Validators.required]],
      },
    );

    if (!this.isAddMode) {
      this.consultationService.getConsultation(this.id.trim())
        .pipe(first())
        .subscribe(x => this.consultationForm.patchValue(x));
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.consultationForm.controls;
  }

  saveConsultation() {
    if (this.isAddMode) {
      this.consultationService.addConsultation(this.consultationForm.value)
        .subscribe({
          next: (consultation: Consultation) => {
            // this.notifyService.showNotification('success', 'Consultations Added');
            console.log("Consultation Created");
            console.log(consultation);
            this.router.navigate(['consultations/']);
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
            this.router.navigate(['consultations/']);
          },
          error: err => {
            console.log(err);
          }
        });
    }
  }

}
