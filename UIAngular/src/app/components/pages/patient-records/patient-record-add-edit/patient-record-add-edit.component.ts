import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/services/toast.service';
import { PatientRecords } from 'src/models/patient-records-model';
import { PatientRecordsService } from 'src/services/patient-records.service';
import * as moment from 'moment';

@Component({
  selector: 'patient-record-add-edit',
  templateUrl: './patient-record-add-edit.component.html',
  styleUrls: ['./patient-record-add-edit.component.scss'],
})
export class PatientRecordAddEditComponent implements OnInit {
  patientRecordMdl: PatientRecords = new PatientRecords();
  isProcessing: boolean = false;
  title: string = '';

  constructor(
    public _activeModal: NgbActiveModal,
    public _toastService: ToastService,
    public _patientRecordSrv: PatientRecordsService
  ) {}

  ngOnInit() {
    if (this.patientRecordMdl.id > 0) {
      this.patientRecordMdl.dateOfBirth = moment(
        this.patientRecordMdl.dateOfBirth
      ).format('YYYY-MM-DD');
    }
  }

  savePatientRecord() {
    try {
      this.patientRecordMdl.dateOfBirth = moment(
        this.patientRecordMdl.dateOfBirth
      ).format('YYYY-MM-DD');

      if (this.patientRecordMdl.id > 0) {
        this.isProcessing = true;
        this._patientRecordSrv
          .Update(JSON.stringify(this.patientRecordMdl))
          .subscribe(
            (result) => {
              this._toastService.show(
                `Patient record ${this.patientRecordMdl.name} updated successfully`,
                {
                  classname: 'bg-success text-light',
                  delay: 10000,
                }
              );
              this.isProcessing = false;
              this._activeModal.close(true);
            },
            (error: HttpErrorResponse) => {
              this.isProcessing = false;
              this._toastService.show(error.error, {
                classname: 'bg-danger text-light',
                delay: 10000,
              });
            }
          );
      } else {
        this.isProcessing = true;
        this._patientRecordSrv
          .create(JSON.stringify(this.patientRecordMdl))
          .subscribe(
            (result) => {
              this._toastService.show(
                `Patient record ${this.patientRecordMdl.name} created successfully`,
                {
                  classname: 'bg-success text-light',
                  delay: 10000,
                }
              );
              this.isProcessing = false;
              this._activeModal.close(true);
            },
            (error: HttpErrorResponse) => {
              this.isProcessing = false;
              this._toastService.show(error.error, {
                classname: 'bg-danger text-light',
                delay: 10000,
              });
            }
          );
      }
    } catch (error) {}
  }
}
