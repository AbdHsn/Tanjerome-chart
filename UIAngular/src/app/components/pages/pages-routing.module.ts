import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { NoPageFountComponent } from './no-page-fount/no-page-fount.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
  },
  { path: 'task-list', component: TaskListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PagesRoutingModule {}
