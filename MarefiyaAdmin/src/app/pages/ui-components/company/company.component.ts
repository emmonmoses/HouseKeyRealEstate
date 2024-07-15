import { Component, OnInit, ViewChild } from '@angular/core';
import { Company } from 'src/app/model/company/company.model';
import { CompanyService } from './company.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  hidden = false;
  pages: number[] = [];
  companies?: Company[];
  company?: Company;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private companyService: CompanyService,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllCompanies();
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  getAllCompanies() {
    this.busy = true;
    return lastValueFrom(this.companyService.getAllCompany())
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.companies = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.companies = [];
            this.toastService.error('No Company Found');
          }
        },
        (error) => {
          this.toastService.error('No Company Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching companies:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(company: Company) {
    this.company = company;
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

  editCompany(company: Company) {
    this.route.navigate(['/ui-components/edit-company']);
    this.storageService.setData(this.keyService.COMPANYOBJECT_KEY, company);
  }

  deleteCompany(companyId: string, adminCode: string) {
    return lastValueFrom(
      this.companyService.deleteCompany(companyId, adminCode)
    );
  }

  delete(company: Company) {
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
        this.deleteCompany(company.id!, this.userType)
          .then(
            (result) => {
              this.companies = this.companies?.filter(
                (comp) => comp !== company
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
