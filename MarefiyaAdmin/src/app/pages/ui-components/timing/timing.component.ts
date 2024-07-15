import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Timing } from 'src/app/model/timing/timing.model';
import { TimingService } from './timing.service';

@Component({
  selector: 'app-timing',
  templateUrl: './timing.component.html',
  styleUrl: './timing.component.scss',
})
export class TimingComponent implements OnInit {
  pages: number[] = [];
  timings?: Timing[];
  timing?: Timing;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private timingService: TimingService,
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
    this.getAllTimings();
  }

  getAllTimings() {
    this.busy = true;
    return lastValueFrom(
      this.timingService.getAllTiming(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.timings = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.timings = [];
            this.toastService.error('No Timings Found');
          }
        },
        (error) => {
          this.toastService.error('No Timings Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Timings:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(timing: Timing) {
    this.timing = timing;
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

  editTiming(timing: Timing) {
    this.route.navigate(['/ui-components/edit-timing']);
    this.storageService.setData(this.keyService.TIMING_KEY, timing);
  }

  deleteTiming(vehicleId: string, adminCode: string) {
    return lastValueFrom(this.timingService.deleteTiming(vehicleId, adminCode));
  }

  delete(timing: Timing) {
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
        this.deleteTiming(timing.id!, this.userType)
          .then(
            (result) => {
              this.timings = this.timings?.filter((time) => time !== timing);
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
