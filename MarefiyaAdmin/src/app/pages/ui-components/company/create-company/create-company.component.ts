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
import { CompanyCreate } from 'src/app/model/company/company-create.model';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.scss',
})
export class CreateCompanyComponent implements OnInit {
  [x: string]: any;

  model: CompanyCreate = new CompanyCreate();
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
    phoneNumber: new FormControl('', [
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
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
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

  create(company: CompanyCreate) {
    return lastValueFrom(this.companyService.createCompany(company));
  }

  createCompany() {
    this.busy = true;
    const cityValue = `${this.form.get('city')?.value}`;
    const cityRegion = `${this.form.get('region')?.value}`;
    // const countryValue = `${this.form.get("country")?.value}`;
    const countryValue = this.country;
    const phoneNumber = `${this.form.get('phoneNumber')?.value}`;

    if (typeof phoneNumber === 'string') {
      this.code = `+${phoneNumber.slice(0, 3)}`;

      this.number = Number(phoneNumber.slice(3));
    }

    this.address = new Address(cityValue, countryValue, cityRegion);
    this.phone = new Phone(this.code, this.number);

    this.model.name = this.form.get('name')?.value!;
    this.model.email = this.form.get('email')!.value!;
    this.model.password = this.form.get('password')!.value!;
    this.model.address = this.address;
    this.model.phone = this.phone;
    this.model.roleId = this.selectedRoleId ?? '';

    console.log(this.model);

    this.create(this.model)
      .then(
        (result) => {
          this.toastService.success('Success');
          this.form.reset();
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

  goBack() {
    this.location.back();
  }
}
