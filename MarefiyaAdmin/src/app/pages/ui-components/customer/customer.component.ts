import { Component, ViewChild } from '@angular/core';
import { Customer } from 'src/app/model/customer/customer.model';
import { CustomerService } from './customer.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  hidden = false;
  pages: number[] = [];
  customers?: Customer[];
  customer?: Customer;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;
  userType!: string;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllCustomers();
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

  getAllCustomers() {
    this.busy = true;
    return lastValueFrom(this.customerService.getAll())
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.customers = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.customers = [];
            this.toastService.error('No Customer Found');
          }
        },
        (error) => {
          this.toastService.error('No Customer Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Customers:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(customer: Customer) {
    this.customer = customer;
    this.modalService
      .open(this.viewModal, { ariaLabelledBy: 'viewModalLabel' })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  edit(customer: Customer) {
    this.route.navigate(['/ui-components/edit-customer']);
    this.storageService.setData(this.keyService.CUSTOMER_OBJECT_KEY, customer);
  }

  deleteAgent(customerId: string, adminCode: string) {
    return lastValueFrom(
      this.customerService.delete(customerId, adminCode)
    );
  };

  delete(customer: Customer) {
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
        this.deleteAgent(customer.id!, this.userType)
          .then(
            (result) => {
              this.customers = this.customers?.filter(
                (ag) => ag !== customer
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
