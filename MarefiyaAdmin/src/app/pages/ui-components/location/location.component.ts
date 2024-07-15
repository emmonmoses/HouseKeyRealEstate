import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { LocationService } from './location.service';
import { Locations } from 'src/app/model/locations/location.model';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent implements OnInit {
  pages: number[] = [];
  locations?: Locations[];
  location?: Locations;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private locationService: LocationService,
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
    this.getAllLocation();
  }

  getAllLocation() {
    this.busy = true;
    return lastValueFrom(
      this.locationService.getAllLocation(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.locations = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.locations = [];
            this.toastService.error('No Locations Found');
          }
        },
        (error) => {
          this.toastService.error('No Locations Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Locations:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(location: Locations) {
    this.location = location;
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

  editLocation(location: Locations) {
    this.route.navigate(['/ui-components/edit-location']);
    this.storageService.setData(this.keyService.LOCATION_kEY, location);
  }

  deleteLocation(locationId: string, adminCode: string) {
    return lastValueFrom(
      this.locationService.deleteLocation(locationId, adminCode)
    );
  }

  delete(location: Locations) {
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
        this.deleteLocation(location.id!, this.userType)
          .then(
            (result) => {
              this.locations = this.locations?.filter(
                (loc) => loc !== location
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
