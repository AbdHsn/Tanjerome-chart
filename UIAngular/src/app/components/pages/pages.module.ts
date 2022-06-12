import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskAddEditComponent } from './task/task-add-edit/task-add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [PagesComponent, TaskListComponent, TaskAddEditComponent],
  providers: [],
})
export class PagesModule {}
