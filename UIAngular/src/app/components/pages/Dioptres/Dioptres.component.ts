import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dioptres } from 'src/models/dioptres';
import { PatientRecords } from 'src/models/patient-records-model';
import { CommonService } from 'src/services/common.service';
import { DioptresService } from 'src/services/dioptres.service';
import { ToastService } from 'src/services/toast.service';
import { DeleteDialogComponent } from '../common-pages/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-Dioptres',
  templateUrl: './Dioptres.component.html',
  styleUrls: ['./Dioptres.component.scss'],
})
export class DioptresComponent implements OnInit {
  patientName: string = '';
  trackedNumber: string = '';
  patientId: number = 0;
  dob: string = '';
  dioptresMdlLst: Dioptres[] = [];
  dioptreMdl: Dioptres = new Dioptres();
  isLoading: boolean = false;
  isProcessing: boolean = false;
  constructor(
    public _activeModal: NgbActiveModal,
    private _dioptreSrv: DioptresService,
    private _toastSrv: ToastService,
    private _modalSrv: NgbModal
  ) {}

  ngOnInit() {
    this.getDioptres();
  }

  getDioptres() {
    try {
      this.isLoading = true;
      this._dioptreSrv.getByParentId(this.patientId).then(
        (res) => {
          this.dioptresMdlLst = res as Dioptres[];
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

  saveDioptre() {
    try {
      this.isProcessing = true;
      this.dioptreMdl.patientId = this.patientId;
      this.dioptreMdl.dateOfBirth = this.dob;
      this._dioptreSrv.create(JSON.stringify(this.dioptreMdl)).subscribe(
        (result) => {
          this._toastSrv.show(`New dioptre created successfully`, {
            classname: 'bg-success text-light',
            delay: 10000,
          });
          this.getDioptres();
          this.isProcessing = false;
          this.viewCreateForm = false;
        },
        (error: HttpErrorResponse) => {
          this.isProcessing = false;
          this._toastSrv.show(error.error, {
            classname: 'bg-danger text-light',
            delay: 10000,
          });
        }
      );
    } catch (error) {}
  }

  viewCreateForm: boolean = false;
  viewCreateFormClick() {
    this.viewCreateForm = true;
    this.dioptreMdl = new Dioptres();
  }
  closeCreateForm() {
    this.viewCreateForm = false;
  }

  onDeleteClick(item: Dioptres) {
    try {
      const modalRef = this._modalSrv.open(DeleteDialogComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = `"${item.dioptre}"`;
      modalRef.result.then((result) => {
        if (result as boolean) {
          this._dioptreSrv.Delete(item.id).subscribe(
            (res) => {
              if (res as boolean) {
                this._toastSrv.show(`${item.dioptre} successfully deleted.`, {
                  classname: 'bg-success text-light',
                  delay: 10000,
                });
                this.getDioptres();
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
}
