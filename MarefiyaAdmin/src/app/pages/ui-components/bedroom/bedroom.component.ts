import { Component, ViewChild } from '@angular/core';
import { BedRoom } from 'src/app/model/bedroom/bedroom.model';
import { BedroomService } from './bedroom.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bedroom',
  templateUrl: './bedroom.component.html',
  styleUrl: './bedroom.component.scss'
})
export class BedroomComponent {
  hidden = false;
  pages: number[] = [];
  bedrooms?: BedRoom[];
  bedroom?: BedRoom;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private bedroomService: BedroomService,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllBedrooms();
  }

  getAllBedrooms() {
    this.busy = true;
    return lastValueFrom(this.bedroomService.getAll())
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.bedrooms = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.bedrooms = [];
            this.toastService.error('No Bedroom Found');
          }
        },
        (error) => {
          this.toastService.error('No Bedroom Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Bedrooms:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  };

  view(bedroom: BedRoom) {
    this.bedroom = bedroom;
    this.modalService
      .open(this.viewModal, { ariaLabelledBy: 'viewModalLabel' })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  edit(bedroom: BedRoom) {
    this.route.navigate(['/ui-components/edit-bedroom']);
    this.storageService.setData(this.keyService.BEDROOM_OBJCT_KEY, bedroom);
  }

  deleteBedroom(bedroomId: string, adminCode: string) {
    return lastValueFrom(
      this.bedroomService.delete(bedroomId, adminCode)
    );
  };

  delete(bedroom: BedRoom) {
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
        this.deleteBedroom(bedroom.id!, this.userType)
          .then(
            (result) => {
              this.bedrooms = this.bedrooms?.filter(
                (bd) => bd !== bedroom
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
