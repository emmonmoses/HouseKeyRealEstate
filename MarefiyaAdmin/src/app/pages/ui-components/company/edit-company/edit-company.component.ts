import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/model/address.model';
import { Company } from 'src/app/model/company/company.model';
import { Phone } from 'src/app/model/phone.model';
import { CompanyService } from '../company.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { Location } from '@angular/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Country } from '@angular-material-extensions/select-country';
import { RoleService } from 'src/app/pages/authentication/role/role.service';
import { RoleResponse } from 'src/app/model/role/role-response.model';
import { Role } from 'src/app/model/role/role.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss',
})
export class EditCompanyComponent implements OnInit {
  company!: Company;
  model: Company = new Company();
  address!: Address;
  phone!: Phone;
  code!: string;
  country!: string;
  number!: number;
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  selectedRoleId?: string;
  roles?: Role[];

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    phoneNumber: new FormControl(0, [
      Validators.required,
      Validators.maxLength(12),
    ]),
    city: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    roleId: new FormControl('', [Validators.required]),
  });

  constructor(
    private companyService: CompanyService,
    private toastService: ToastService,
    private messageService: MessageService,
    private location: Location,
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.company = this.authService.getCompanyObject;
    this.populateData(this.company);
    this.getAllRole();
  }

  onCountrySelected(event: Country) {
    this.country = event.name!;
  }

  onRoleChange(event: any) {
    const role = event.value;
    this.selectedRoleId = role;
  }

  public getRole(): Promise<any> {
    return firstValueFrom(this.roleService.getRoles(this.page, this.pageSize));
  }

  getAllRole(): void {
    this.busy = true;
    this.getRole()
      .then(
        (result: RoleResponse) => {
          if (!result.data || result.data.length === 0) {
            this.toastService.error('No Roles Found');
          } else {
            this.roles = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          }
        },
        (error) => {
          this.toastService.error(this.messageService.serverError);
        }
      )
      .finally(() => {
        this.busy = false;
      });
  }

  populateData(arg: Company) {
    this.form.get('name')?.setValue(arg.name);
    this.form.get('email')?.setValue(arg.email);
    var phone = Number(arg.phone!.code + arg.phone!.number.toString());
    this.form.get('phoneNumber')?.setValue(phone);

    this.form.get('city')?.setValue(arg.address!.city);
    this.form.get('country')?.setValue(arg.address!.country);
    this.form.get('region')?.setValue(arg.address!.region);
    this.form.get('roleId')?.setValue(arg.role.id);
  }

  update(company: Company) {
    return lastValueFrom(this.companyService.updateCompany(company));
  }

  updateCompany() {
    this.busy = true;
    const cityValue = `${this.form.get('city')?.value}`;
    const countryValue = this.company.address?.country || this.country;

    const regionValue = `${this.form.get('region')?.value}`;
    const phoneNumber = `${this.form.get('phoneNumber')?.value}`;

    if (typeof phoneNumber === 'string') {
      this.code = `+${phoneNumber.slice(0, 3)}`;

      this.number = Number(phoneNumber.slice(3));
    }

    this.address = new Address(cityValue, countryValue, regionValue);
    this.phone = new Phone(this.code, this.number);

    this.model.name = this.form.get('name')?.value!;
    this.model.email = this.form.get('email')!.value!;
    this.model.address = this.address;
    this.model.status = this.company.status;
    this.model.phone = this.phone;
    this.model.id = this.company.id;

    console.log(this.model);

    this.update(this.model)
      .then(
        (result) => {
          this.toastService.success('Success');
          this.location.back();
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
}
