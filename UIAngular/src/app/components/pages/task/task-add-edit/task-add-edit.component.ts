import {
  CommonService,
  enumToList,
} from './../../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tasks, TaskStatus } from 'src/models/task-model';
import { TasksService } from 'src/services/tasks.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-task-add-edit',
  templateUrl: './task-add-edit.component.html',
  styleUrls: ['./task-add-edit.component.scss'],
})
export class TaskAddEditComponent implements OnInit {
  taskMdl: Tasks = new Tasks();
  isProcessing: boolean = false;
  statusDdlLst: any[] = [];
  title: string = '';

  constructor(
    public _activeModal: NgbActiveModal,
    public _toastService: ToastService,
    public _taskSrv: TasksService
  ) {
    this.statusDdlLst = enumToList(TaskStatus);
  }

  ngOnInit() {
    if (this.taskMdl.id <= 0) {
      this.taskMdl.status = null;
    }
  }

  saveTask() {
    try {
      if (this.taskMdl.id > 0) {
        this.isProcessing = true;
        this._taskSrv.Update(JSON.stringify(this.taskMdl)).subscribe(
          (result) => {
            this._toastService.show(
              `Task ${this.taskMdl.title} updated successfully`,
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
        this._taskSrv.create(JSON.stringify(this.taskMdl)).subscribe(
          (result) => {
            this._toastService.show(
              `Task ${this.taskMdl.title} created successfully`,
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
