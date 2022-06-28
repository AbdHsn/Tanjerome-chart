import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/services/toast.service';
import { DeleteDialogComponent } from '../../common-pages/delete-dialog/delete-dialog.component';
import { SignalRResponse } from 'src/models/signal-r-response';
import { CommonService } from 'src/services/common.service';
import { ChartData, PatientRecords } from 'src/models/patient-records-model';
import { PatientRecordsService } from 'src/services/patient-records.service';
import { PatientRecordAddEditComponent } from '../patient-record-add-edit/patient-record-add-edit.component';
import * as moment from 'moment';
import Chart from 'chart.js/auto';
import { DioptresComponent } from '../../Dioptres/Dioptres.component';
import { DioptresService } from 'src/services/dioptres.service';
import { Dioptres } from 'src/models/dioptres';

@Component({
  selector: 'patient-record-list',
  templateUrl: './patient-record-list.component.html',
  styleUrls: ['./patient-record-list.component.scss'],
})
export class PatientRecordListComponent implements OnInit {
  patientRecordMdlLst: PatientRecords[] = [];
  dioptresMdlLst: Dioptres[] = [];
  selectedPatient: PatientRecords = new PatientRecords();
  isLoading: boolean = false;
  searchByName: string = '';
  searchByPhone: string = '';
  searchByPatientId: string = '';

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
    private _dioptreSrv: DioptresService,
    private modalService: NgbModal,
    private _toastSrv: ToastService,
    private _commonSrv: CommonService
  ) {}

  ngOnInit() {
    this.getPatientGrid();
    this.initializeSignalR();
  }

  getPatientGrid() {
    if (this.isLoading) return;
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
          { search_by: 'patientId', value: this.searchByPatientId },
        ],
      };

      this.isLoading = true;
      this._patientRecordSrv.getGrid(postData).subscribe(
        (res) => {
          this.patientRecordMdlLst = res.data as PatientRecords[];
          this.totalRecord = res.totalRecords as number;
          this.isLoading = false;

          if (this.patientRecordMdlLst.length > 0) {
            this.getDioptres(this.patientRecordMdlLst[0]);
          }
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

  onDioptresClick(item: PatientRecords) {
    const modalRef = this.modalService.open(DioptresComponent);
    modalRef.componentInstance.title = `Dioptres of ${item.name}, Id:${item.patientId}`;

    modalRef.componentInstance.patientId = item.id;
    modalRef.componentInstance.patientName = item.name;
    modalRef.componentInstance.trackedNumber = item.patientId;
    modalRef.componentInstance.dob = moment(item.dateOfBirth).format(
      'YYYY-MM-DD'
    );
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
  onSearchByPatientId(event: any) {
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
    console.log('signalR connection....', connection);

    connection.on('BroadcastMessage', (result) => {
      this.getPatientGrid();
    });
  }

  public patientBarChart: any;

  drawPatientBarChart() {
    let chartStatus = Chart.getChart('patientBarChart'); // <canvas> id
    if (chartStatus) {
      chartStatus.destroy();
    }

    this.patientBarChart = new Chart('patientBarChart', {
      type: 'bar',
      data: {
        labels: this.dioptresMdlLst.map((m) => 'Age: ' + m.calculatedAge),
        datasets: [
          {
            label: 'SE',
            borderColor: 'rgb(211,211,211)',
            backgroundColor: this.dioptresMdlLst.map(
              (m) =>
                'rgb(' +
                (Math.floor((256 - 199) * Math.random()) + 200) +
                ',' +
                (Math.floor((256 - 199) * Math.random()) + 200) +
                ',' +
                (Math.floor((256 - 199) * Math.random()) + 200) +
                0.6 +
                ')'
            ),
            data: this.dioptresMdlLst.map((m) => m.dioptre),

            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: -10,
            max: 1,
            reverse: true,
            ticks: {
              // forces step size to be 50 units
              stepSize: 1.0,
            },
          },
        },
      },
    });
  }

  clearDrawnChart() {
    let chartStatus = Chart.getChart('patientBarChart'); // <canvas> id
    if (chartStatus) {
      chartStatus.destroy();
    }
  }

  getDioptres(item: PatientRecords) {
    try {
      this.isLoading = true;
      this._dioptreSrv.getByParentId(item.id).then(
        (res) => {
          this.dioptresMdlLst = res as Dioptres[];
          if (this.dioptresMdlLst.length > 0) {
            this.drawPatientBarChart();
            this.selectedPatient = item;
          } else {
            this.clearDrawnChart();
            this.selectedPatient = {} as PatientRecords;
          }
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this._toastSrv.show(error.error, {
            classname: 'bg-danger text-light',
            delay: 10000,
          });
          this.isLoading = false;
        }
      );
    } catch (error) {
      this.isLoading = false;
    }
  }
}
