import { Component, ViewChild } from '@angular/core';
import { FeeType } from 'src/app/model/fee-type/fee-type.model';
import { FeeTypeService } from './fee-type.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fee-type',
  templateUrl: './fee-type.component.html',
  styleUrl: './fee-type.component.scss'
})
export class FeeTypeComponent {
  hidden = false;
  pages: number[] = [];
  feeTypes?: FeeType[];
  feeType?: FeeType;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private feeTypeService: FeeTypeService,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllFeeTypes();
  }

  getAllFeeTypes() {
    this.busy = true;
    return lastValueFrom(this.feeTypeService.getAll())
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.feeTypes = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.feeTypes = [];
            this.toastService.error('No Fee Type Found');
          }
        },
        (error) => {
          this.toastService.error('No Fee Type Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Fee Types:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  };

  view(feeType: FeeType) {
    this.feeType = feeType;
    this.modalService
      .open(this.viewModal, { ariaLabelledBy: 'viewModalLabel' })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  edit(feeType: FeeType) {
    this.route.navigate(['/ui-components/edit-fee-type']);
    this.storageService.setData(this.keyService.FEETYPE_OBJECT_KEY, feeType);
  }

  deleteAgent(feeTypeId: string, adminCode: string) {
    return lastValueFrom(
      this.feeTypeService.delete(feeTypeId, adminCode)
    );
  };

  delete(feeType: FeeType) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.busy = true;
        this.deleteAgent(feeType.id!, this.userType)
          .then(
            (result) => {
              this.feeTypes = this.feeTypes?.filter(
                (ft) => ft !== feeType
              );
              this.toastService.success('Success');
            },
            (reject) => {
              this.toastService.error(this.messageService.serverError);
            }
          )
          .catch((error) => {
            this.toastService.error(this.messageService.serverError);
          })
          .finally(() => {
            this.busy = false;
          });
      }
    });
  }

}
