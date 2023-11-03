import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import Swal from "sweetalert2";
import {ConsultationService} from "../../services/consultation/consultation.service";
import {Consultation} from "../../models/consultation.model";

@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.scss']
})
export class ConsultationsComponent implements OnInit {
  allConsultations!: Consultation[];

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(public consultationService: ConsultationService) {
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      scrollX: false,
      scrollY: false,
    };
    this.fetchUsers();

  }

  fetchUsers() {
    this.consultationService.getConsultations().subscribe({
      next: (consultations: Consultation[]) => {
        this.allConsultations = consultations;
        this.dtTrigger.next(void 0);
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


  humanize(str: String) {
    let i: number;
    const frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }
}
