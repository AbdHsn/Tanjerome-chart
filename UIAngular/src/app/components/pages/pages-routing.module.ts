import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NoPageFountComponent } from './no-page-fount/no-page-fount.component';
import { PatientRecordListComponent } from './patient-records/patient-record-list/patient-record-list.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
  },
  { path: 'patient-records', component: PatientRecordListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PagesRoutingModule {}
