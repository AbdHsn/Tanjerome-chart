import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonService } from 'src/services/common.service';
import { ToastService } from 'src/services/toast.service';
import { TasksService } from 'src/services/tasks.service';
import { ToastsContainer } from 'src/services/ToastsContainer.component';
import { NgbdToastGlobal } from './components/pages/common-pages/toast-global/toast-global.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ToastsContainer,
    NgbdToastGlobal,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxNavbarModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
  ],
  providers: [HttpClient, CommonService, ToastService, TasksService],
  bootstrap: [AppComponent, NgbdToastGlobal],
})
export class AppModule {}
