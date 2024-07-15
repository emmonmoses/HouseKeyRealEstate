import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Driver } from 'src/app/model/driver/driver.model';
import { DriversService } from './drivers.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss',
})
export class DriversComponent implements OnInit {
  pages: number[] = [];
  drivers?: Driver[];
  driver?: Driver;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private driversService: DriversService,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.busy = true;
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllDrivers();
    this.busy = false;
  }

  getAllDrivers() {
    this.busy = true;
    return lastValueFrom(
      this.driversService.getAllDrivers(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.drivers = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.drivers = [];
            this.toastService.error('No Drivers Found');
          }
        },
        (error) => {
          this.toastService.error('No Drivers Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Drivers:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(driver: Driver) {
    this.driver = driver;
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

  editDriver(driver: Driver) {
    this.route.navigate(['/ui-components/edit-driver']);
    this.storageService.setData(this.keyService.DRIVER_KEY, driver);
  }

  deleteVehicle(driverId: string, adminCode: string) {
    return lastValueFrom(this.driversService.deleteDriver(driverId, adminCode));
  }

  delete(driver: Driver) {
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
        this.deleteVehicle(driver.id!, this.userType)
          .then(
            (result) => {
              this.drivers = this.drivers?.filter(
                (driver) => driver !== driver
              );
              this.toastService.success('Success');
              this.getAllDrivers();
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
