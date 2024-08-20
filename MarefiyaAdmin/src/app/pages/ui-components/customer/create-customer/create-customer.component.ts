import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/model/customer/customer.model';
import { Role } from 'src/app/model/role/role.model';
import { CustomerService } from '../customer.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { RoleService } from 'src/app/pages/authentication/role/role.service';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RoleResponse } from 'src/app/model/role/role-response.model';
import { Phone } from 'src/app/model/phone.model';
import { Address } from 'src/app/model/address/address.model';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss'
})
export class CreateCustomerComponent {
  busy: boolean = false;
  roles?: Role[];
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  selectedRoleId?: string;
  model: Customer = new Customer();

  form = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fathername: new FormControl('', [Validators.required, Validators.minLength(3)]),
    grandfathername: new FormControl('', [Validators.required, Validators.minLength(3)]),
    age: new FormControl(0, Validators.required),
    gender: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    phoneNumber: new FormControl(0, Validators.required),
    city: new FormControl('', Validators.required),
    subCity: new FormControl('', Validators.required),
    kebele: new FormControl('', Validators.required),
    houseNumber: new FormControl('', Validators.required),
    roleId: new FormControl('', [Validators.required]),
    status: new FormControl(false, [Validators.required]),
  });

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private messageService: MessageService,
    // private location: Location,
    private roleService: RoleService,
    private keyService: KeyService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.getAllRole();
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

  create(customer: Customer) {
    return lastValueFrom(this.customerService.create(customer));
  }

  createCustomer() {
    this.busy = true;

    let phone = new Phone("+251", this.form.get('phoneNumber')?.value!);
    let address = new Address(
      this.form.get('city')?.value!,
      this.form.get('kebele')?.value!,
      this.form.get('subCity')?.value!,
      this.form.get('houseNumber')?.value!,
    );

    this.model.firstname = this.form.get('firstname')?.value!;
    this.model.fathername = this.form.get('fathername')?.value!;
    this.model.grandfathername = this.form.get('grandfathername')?.value!;
    this.model.age = this.form.get('age')?.value!;
    this.model.gender = this.form.get('gender')?.value!;
    this.model.email = this.form.get('email')?.value!;
    this.model.password = this.form.get('password')!.value!;
    this.model.phone = phone;
    this.model.address = address;
    this.model.status = this.form.get('status')!.value!;
    this.model.roleId = this.selectedRoleId ?? '';

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

}
