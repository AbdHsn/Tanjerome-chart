import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/services/toast.service';
import { DeleteDialogComponent } from '../../common-pages/delete-dialog/delete-dialog.component';
import { SignalRResponse } from 'src/models/signal-r-response';
import { CommonService } from 'src/services/common.service';
import { PatientRecords } from 'src/models/patient-records-model';
import { PatientRecordsService } from 'src/services/patient-records.service';
import { PatientRecordAddEditComponent } from '../patient-record-add-edit/patient-record-add-edit.component';
import * as moment from 'moment';

@Component({
  selector: 'patient-record-list',
  templateUrl: './patient-record-list.component.html',
  styleUrls: ['./patient-record-list.component.scss'],
})
export class PatientRecordListComponent implements OnInit {
  patientRecordMdlLst: PatientRecords[] = [];
  isLoading: boolean = false;
  searchByName: string = '';
  searchByPhone: string = '';

  orderColumn = {
    column: 'InsertDate',
    order_by: 'DESC',
  };

  page = 1;
  rowSize = 10;
  totalRecord = 0;
  rowSizeOption = [10, 20, 50, 100, 200];

  constructor(
    private _patientRecordSrv: PatientRecordsService,
    private modalService: NgbModal,
    private _toastSrv: ToastService,
    private _commonSrv: CommonService
  ) {}

  ngOnInit() {
    this.getPatientGrid();
    this.initializeSignalR();
  }

  getPatientGrid() {
    try {
      let postData = {
        columns: [],
        orders: [this.orderColumn],
        start: (this.page - 1) * this.rowSize,
        length: this.rowSize.toString(),
        search: {},
        searches: [
          { search_by: 'name', value: this.searchByName },
          { search_by: 'phone', value: this.searchByPhone },
        ],
      };

      this.isLoading = true;
      this._patientRecordSrv.getGrid(postData).subscribe(
        (res) => {
          this.patientRecordMdlLst = res.data as PatientRecords[];
          this.totalRecord = res.totalRecords as number;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this._toastSrv.show(error.error, {
            classname: 'bg-danger text-light',
            delay: 10000,
          });
        }
      );
    } catch (error) {
      this.isLoading = false;
    }
  }

  onRowSizeOptionChange(selectedSizeOption: any): void {
    this.rowSize = selectedSizeOption.target.value;
    this.page = 1;
    this.getPatientGrid();
  }

  onPaginationChange(pageNumber: any) {
    this.page = pageNumber;
    this.getPatientGrid();
  }

  onOrderByClick(columnName: string) {
    this.orderColumn.order_by =
      this.orderColumn.order_by == 'DESC' ? 'ASC' : 'DESC';

    this.orderColumn.column = columnName;

    this.getPatientGrid();
  }

  onCreateClick() {
    const modalRef = this.modalService.open(PatientRecordAddEditComponent);
    modalRef.componentInstance.title = 'Create Patient Record';
    modalRef.componentInstance.patientRecordMdl = {};
    modalRef.result.then(
      (result) => {
        //this.getPatientGrid();
      },
      (reason) => {}
    );
  }

  onEditClick(item: PatientRecords) {
    const modalRef = this.modalService.open(PatientRecordAddEditComponent);
    modalRef.componentInstance.title = 'Update Patient Record';

    modalRef.componentInstance.patientRecordMdl = Object.assign({}, item);
    modalRef.result.then(
      (result) => {
        // this.getPatientGrid();
      },
      (reason) => {}
    );
  }

  onDeleteClick(item: PatientRecords) {
    try {
      const modalRef = this.modalService.open(DeleteDialogComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = `Patient "${item.name}"`;
      modalRef.result.then((result) => {
        if (result as boolean) {
          this._patientRecordSrv.Delete(item.id).subscribe(
            (res) => {
              if (res as boolean) {
                this._toastSrv.show(
                  `Patient ${item.name} successfully deleted.`,
                  {
                    classname: 'bg-success text-light',
                    delay: 10000,
                  }
                );
                //this.getPatientGrid();
              }
            },
            (error: HttpErrorResponse) => {
              this._toastSrv.show(error.error, {
                classname: 'bg-danger text-light',
                delay: 10000,
              });
            }
          );
        }
      });
    } catch (error) {}
  }

  onSearchByName(event: any) {
    if (event.key === 'Enter') {
      this.getPatientGrid();
    }
  }

  onSearchByPhone(event: any) {
    if (event.key === 'Enter') {
      this.getPatientGrid();
    }
  }

  initializeSignalR() {
    let connection = this._commonSrv.signalRConnectionInitilization();

    connection.on('BroadcastMessage', (result) => {
      let getTopic = JSON.parse(result as string) as SignalRResponse;
      let latestPatientRecord = getTopic.data as PatientRecords;

      switch (getTopic.topic) {
        case 'Patient-Record-Created': {
          this.patientRecordMdlLst.push(latestPatientRecord);
          this.totalRecord = this.totalRecord + 1;
          break;
        }
        case 'Patient-Record-Updated': {
          let getExistedTask = this.patientRecordMdlLst.find(
            (f) => f.id == latestPatientRecord.id
          );
          if (getExistedTask) {
            getExistedTask.name = latestPatientRecord.name;
            getExistedTask.phone = latestPatientRecord.phone;
            getExistedTask.dioptres = latestPatientRecord.dioptres;
            getExistedTask.dateOfBirth = latestPatientRecord.dateOfBirth;
          }
          break;
        }
        case 'Patient-Record-Deleted': {
          let getExistedTask = this.patientRecordMdlLst.find(
            (f) => f.id == latestPatientRecord.id
          );
          if (getExistedTask) {
            this.patientRecordMdlLst = this.patientRecordMdlLst.filter(
              (f) => f.id != latestPatientRecord.id
            );
          }
          this.totalRecord = this.totalRecord - 1;
          break;
        }
        default:
          break;
      }
    });
  }

  calculateAge(birthdate: any): number {
    return moment().diff(birthdate, 'years');
  }
}
