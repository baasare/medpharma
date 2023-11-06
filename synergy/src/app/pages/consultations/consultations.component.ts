import {ChangeDetectionStrategy, OnInit, Component, ChangeDetectorRef} from '@angular/core';
import {ConsultationService} from "../../services/consultation/consultation.service";
import Swal from "sweetalert2";
import {Subject} from "rxjs";
import {Consultation} from "../../models/consultation.model";

@Component({
  selector: 'app-root',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConsultationsComponent implements OnInit {

  allConsultations!: Consultation[];

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  consultationStatistics: { [id: string]: number; } = {
    "pending": 0,
    "completed": 0,
    "cancelled": 0
  }

  consultation_type: { [id: string]: string; } = {
    "in_patient": "In Patient",
    "out_patient": "Out Patient"
  };

  consultation_status: { [id: string]: string; } = {
    "pending": "Pending",
    "completed": "Completed",
    "cancelled": "Cancelled"
  };

  constructor(public consultationService: ConsultationService, private changeDetectorRef: ChangeDetectorRef,) {
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      scrollX: false,
      scrollY: true,
    };
    this.fetchConsultations();

  }

  fetchConsultations() {
    this.consultationService.getConsultations().subscribe({
      next: (consultations: Consultation[]) => {
        this.allConsultations = consultations.reverse();
        this.consultationStatistics['pending'] = this.allConsultations.filter((consultation) => consultation.status === 'pending').length;
        this.consultationStatistics['completed'] = this.allConsultations.filter((consultation) => consultation.status === 'completed').length;
        this.consultationStatistics['cancelled'] = this.allConsultations.filter((consultation) => consultation.status === 'cancelled').length;

        this.dtTrigger.next(void 0);
        this.changeDetectorRef.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  confirmDelete(id: String) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it.',
      cancelButtonText: 'Cancel',
      customClass: 'swal-wide',
    }).then((result) => {
      if (result.value) {
        this.consultationService.removeConsultation(id)
          .subscribe({
            next: () => {
              this.allConsultations = this.allConsultations.filter(item => item.id !== id);
              Swal.fire({
                title: 'Deleted!',
                text: 'Service definition has been deleted.',
                icon: 'success',
              });
              // this.ngOnInit();
            },
            error: err => {
              console.log(err);
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', '', 'error');
      }
    });
  }


  confirmDeleteDialog(id: String) {
    this.consultationService.removeConsultation(id).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  humanize(str: String) {
    let i: number;
    const frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  checkStatus(isActive: boolean) {
    if (isActive) {
      return 'Active';
    }

    return 'Inactive';
  }

  getConsultationType() {

  }
}
