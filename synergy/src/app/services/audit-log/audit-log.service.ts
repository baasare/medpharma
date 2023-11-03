import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getAuditLogs() {
    return this.http.get<any>(`${environment.api_backend}/audit-log`);
  }
}
