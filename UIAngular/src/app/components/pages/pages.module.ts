import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientRecordListComponent } from './patient-records/patient-record-list/patient-record-list.component';
import { PatientRecordAddEditComponent } from './patient-records/patient-record-add-edit/patient-record-add-edit.component';
import { ChartViewComponent } from './patient-records/chart-view/chart-view.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PagesComponent,
    PatientRecordListComponent,
    PatientRecordAddEditComponent,
    ChartViewComponent,
  ],
  providers: [],
})
export class PagesModule {}
