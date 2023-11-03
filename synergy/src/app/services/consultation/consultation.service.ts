import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {Consultation} from "../../models/consultation.model";

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  getConsultations() {
    return this.http.get<any>(`${environment.api_backend}/consultation`);
  }

  getConsultation(id: any) {
    return this.http
      .get<any>(`${environment.api_backend}/consultation/${id}`);
  }

  addConsultation(Consultation: Consultation) {
    return this.http
      .post<any>(`${environment.api_backend}/consultation`, Consultation);
  }

  updateConsultation(Consultation: {}, id: any) {
    return this.http
      .patch<any>(`${environment.api_backend}/consultation/${id}`, Consultation);
  }

  removeConsultation(id: any) {
    return this.http
      .delete<any>(`${environment.api_backend}/consultation/${id}`);
  }
}
