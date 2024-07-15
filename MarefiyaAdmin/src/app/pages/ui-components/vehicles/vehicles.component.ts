import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
})
export class VehiclesComponent implements OnInit {
  pages: number[] = [];
  vehicles?: Vehicle[];
  vehicle?: Vehicle;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private vehiclesService: VehiclesService,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllVehicles();
  }

  getAllVehicles() {
    this.busy = true;
    return lastValueFrom(
      this.vehiclesService.getAllVehicles(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.vehicles = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.vehicles = [];
            this.toastService.error('No Vehicles Found');
          }
        },
        (error) => {
          this.toastService.error('No Vehicles Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Vehicles:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(vehicle: Vehicle) {
    this.vehicle = vehicle;
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

  editVehicle(vehicle: Vehicle) {
    this.route.navigate(['/ui-components/edit-vehicle']);
    this.storageService.setData(this.keyService.VEHICLEOBJECT_KEY, vehicle);
  }

  deleteVehicle(vehicleId: string, adminCode: string) {
    return lastValueFrom(
      this.vehiclesService.deleteVehicle(vehicleId, adminCode)
    );
  }

  delete(vehicle: Vehicle) {
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
        this.deleteVehicle(vehicle.id!, this.userType)
          .then(
            (result) => {
              this.vehicles = this.vehicles?.filter((veh) => veh !== vehicle);
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
