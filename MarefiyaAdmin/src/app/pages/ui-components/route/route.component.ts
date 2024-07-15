import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { RouteService } from './route.service';
import { Route } from 'src/app/model/route/route.model';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
})
export class RouteComponent implements OnInit {
  pages: number[] = [];
  routes?: Route[];
  route?: Route;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private routeService: RouteService,
    private router: Router,
    private toastService: ToastService,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USERID_KEY);
    this.getAllRoutes();
  }

  getAllRoutes() {
    this.busy = true;
    return lastValueFrom(
      this.routeService.getAllRoute(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.routes = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.routes = [];
            this.toastService.error('No Routes Found');
          }
        },
        (error) => {
          this.toastService.error('No Routes Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Routes:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(route: Route) {
    this.route = route;
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

  editRoute(route: Route) {
    this.router.navigate(['/ui-components/edit-route']);
    this.storageService.setData(this.keyService.ROUTING_KEY, route);
  }

  deleteRoute(routeId: string, adminCode: string) {
    return lastValueFrom(this.routeService.deleteRoute(routeId, adminCode));
  }

  delete(route: Route) {
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
        this.deleteRoute(route.id!, this.userType)
          .then(
            (result) => {
              this.routes = this.routes?.filter((rout) => rout !== route);
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
