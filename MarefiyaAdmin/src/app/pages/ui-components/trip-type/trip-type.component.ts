import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { TripType } from 'src/app/model/trip-type/trip-type.model';
import { TripTypeService } from './trip-type.service';

@Component({
  selector: 'app-trip-type',
  templateUrl: './trip-type.component.html',
  styleUrl: './trip-type.component.scss',
})
export class TripTypeComponent implements OnInit {
  pages: number[] = [];
  tripTypes?: TripType[];
  tripType?: TripType;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private tripTypeService: TripTypeService,
    private router: Router,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllTripType();
  }

  getAllTripType() {
    this.busy = true;
    return lastValueFrom(
      this.tripTypeService.getAllTripType(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.tripTypes = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.tripTypes = [];
            this.toastService.error('No Trip Types Found');
          }
        },
        (error) => {
          this.toastService.error('No Trip Types Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Trip Types:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(tripType: TripType) {
    this.tripType = tripType;
    this.modalService
      .open(this.viewModal, { ariaLabelledBy: 'viewModalLabel' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  formatDateToCustomFormat(dateString: string): string {
    const dateObject = new Date(dateString);

    const formattedDate = dateObject.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return formattedDate;
  }

  editTripType(tripType: TripType) {
    this.route.navigate(['/ui-components/edit-tripType']);
    this.storageService.setData(this.keyService.TRIPTYPE_KEY, tripType);
  }

  deleteVehicle(tripTypeId: string, adminCode: string) {
    return lastValueFrom(
      this.tripTypeService.deleteTripType(tripTypeId, adminCode)
    );
  }

  delete(tripType: TripType) {
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
        this.deleteVehicle(tripType.id!, this.userType)
          .then(
            (result) => {
              this.tripTypes = this.tripTypes?.filter((tr) => tr !== tripType);
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
