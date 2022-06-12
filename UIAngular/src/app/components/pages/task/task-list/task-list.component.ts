import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tasks, TaskStatus } from 'src/models/task-model';
import { TasksService } from 'src/services/tasks.service';
import { ToastService } from 'src/services/toast.service';
import { DeleteDialogComponent } from '../../common-pages/delete-dialog/delete-dialog.component';
import { TaskAddEditComponent } from '../task-add-edit/task-add-edit.component';
import { SignalRResponse } from 'src/models/signal-r-response';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  taskMdlLst: Tasks[] = [];
  isLoading: boolean = false;
  searchByTitle: string = '';

  orderColumn = {
    column: 'insert_date',
    order_by: 'DESC',
  };

  page = 1;
  rowSize = 10;
  totalRecord = 0;
  rowSizeOption = [10, 20, 50, 100, 200];

  constructor(
    private _taskSrv: TasksService,
    private modalService: NgbModal,
    private _toastSrv: ToastService,
    private _commonSrv: CommonService
  ) {}

  ngOnInit() {
    this.getTaskGrid();
    this.initializeSignalR();
  }

  getTaskGrid() {
    try {
      let postData = {
        columns: [],
        orders: [this.orderColumn],
        start: (this.page - 1) * this.rowSize,
        length: this.rowSize.toString(),
        search: {},
        searches: [{ search_by: 'title', value: this.searchByTitle }],
      };

      this.isLoading = true;
      this._taskSrv.getGrid(postData).subscribe(
        (res) => {
          this.taskMdlLst = res.data as Tasks[];
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
    this.getTaskGrid();
  }

  onPaginationChange(pageNumber: any) {
    this.page = pageNumber;
    this.getTaskGrid();
  }

  onOrderByClick(columnName: string) {
    this.orderColumn.order_by =
      this.orderColumn.order_by == 'DESC' ? 'ASC' : 'DESC';

    this.orderColumn.column = columnName;

    this.getTaskGrid();
  }

  onCreateTaskClick() {
    const modalRef = this.modalService.open(TaskAddEditComponent);
    modalRef.componentInstance.title = 'Create Task';
    modalRef.componentInstance.taskMdl = {};
    modalRef.result.then(
      (result) => {
        //this.getTaskGrid();
      },
      (reason) => {}
    );
  }

  onEditClick(item: Tasks) {
    const modalRef = this.modalService.open(TaskAddEditComponent);
    modalRef.componentInstance.title = 'Update Task';

    modalRef.componentInstance.taskMdl = Object.assign({}, item);
    modalRef.result.then(
      (result) => {
        // this.getTaskGrid();
      },
      (reason) => {}
    );
  }

  onDeleteClick(item: Tasks) {
    try {
      const modalRef = this.modalService.open(DeleteDialogComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = `Task "${item.title}"`;
      modalRef.result.then((result) => {
        if (result as boolean) {
          this._taskSrv.Delete(item.id).subscribe(
            (res) => {
              if (res as boolean) {
                this._toastSrv.show(
                  `Task ${item.title} successfully deleted.`,
                  {
                    classname: 'bg-success text-light',
                    delay: 10000,
                  }
                );
                //this.getTaskGrid();
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

  onSearchByTitle(event: any) {
    if (event.key === 'Enter') {
      this.getTaskGrid();
    }
  }

  initializeSignalR() {
    let connection = this._commonSrv.signalRConnectionInitilization();

    connection.on('BroadcastMessage', (result) => {
      let getTopic = JSON.parse(result as string) as SignalRResponse;
      let latestTask = getTopic.data as Tasks;

      switch (getTopic.topic) {
        case 'Task-Created': {
          this.taskMdlLst.push(latestTask);
          this.totalRecord = this.totalRecord + 1;
          break;
        }
        case 'Task-Updated': {
          let getExistedTask = this.taskMdlLst.find(
            (f) => f.id == latestTask.id
          );
          if (getExistedTask) {
            getExistedTask.title = latestTask.title;
            getExistedTask.details = latestTask.details;
            getExistedTask.progress_ratio = latestTask.progress_ratio;
            getExistedTask.status = latestTask.status;
          }
          break;
        }
        case 'Task-Deleted': {
          let getExistedTask = this.taskMdlLst.find(
            (f) => f.id == latestTask.id
          );
          if (getExistedTask) {
            this.taskMdlLst = this.taskMdlLst.filter(
              (f) => f.id != latestTask.id
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

  showStandard() {
    this._toastSrv.show('I am a standard toast');
  }
}
