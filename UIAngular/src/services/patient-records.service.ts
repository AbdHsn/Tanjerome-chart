import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class PatientRecordsService {
  private _baseUrl: string = '';

  constructor(private http: HttpClient) {
    this._baseUrl = environment.baseUrl;
  }

  create(formData: any) {
    return this.http
      .post<any>(this._baseUrl + 'patient-record-api/create', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe();
  }

  Update(formData: any) {
    return this.http
      .put<any>(this._baseUrl + 'patient-record-api/update', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe();
  }

  Delete(id: any) {
    return this.http
      .delete<any>(this._baseUrl + 'patient-record-api/delete/' + id)
      .pipe();
  }

  getGrid(dataTable: any) {
    return this.http.post<any>(
      this._baseUrl + 'patient-record-api/get-grid',
      dataTable
    );
  }

  get() {
    return this.http.get(this._baseUrl + 'patient-record-api/get');
  }

  getById(id: number): Promise<any> {
    return this.http
      .get(this._baseUrl + 'patient-record-api/get/' + id)
      .toPromise();
  }
}
