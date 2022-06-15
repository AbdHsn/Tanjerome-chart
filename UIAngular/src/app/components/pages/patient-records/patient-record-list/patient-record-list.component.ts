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

          if (this.patientRecordMdlLst.length > 0) {
            this.drawPatientBarChart(this.patientRecordMdlLst[0].chartData);
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
    console.log('signalR connection....', connection);

    connection.on('BroadcastMessage', (result) => {
      this.getPatientGrid();
    });
  }

  populateChartData(item: ChartData) {
    this.drawPatientBarChart(item);
  }

  public patientBarChart: any;
  drawPatientBarChart(chartModel: ChartData) {
    let chartStatus = Chart.getChart('patientBarChart'); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    this.patientBarChart = new Chart('patientBarChart', {
      type: 'bar',
      data: {
        // labels: model.map((t) =>
        //   this.datePipe.transform(t.CreatedDate, 'dd-MM-yy hh:mm')
        // ),
        labels: chartModel.label,
        datasets: [
          {
            label: 'Pyopia Progression',
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192, 0.2)',
            //data: model.map((t) => t.CurrentOnline),
            data: chartModel.data,

            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 10,
          },
        },
      },
    });
  }
}
