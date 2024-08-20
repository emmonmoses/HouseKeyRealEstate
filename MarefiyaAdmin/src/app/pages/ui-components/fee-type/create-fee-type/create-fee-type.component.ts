import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeeType } from 'src/app/model/fee-type/fee-type.model';
import { FeeTypeService } from '../fee-type.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { RoleService } from 'src/app/pages/authentication/role/role.service';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-fee-type',
  templateUrl: './create-fee-type.component.html',
  styleUrl: './create-fee-type.component.scss'
})
export class CreateFeeTypeComponent {
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  selectedRoleId?: string;
  model: FeeType = new FeeType();
  adminCode!: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    amount: new FormControl(0, [Validators.required]),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private feeTypeService: FeeTypeService,
    private toastService: ToastService,
    private messageService: MessageService,
    private roleService: RoleService,
    private keyService: KeyService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.adminCode = this.storageService.getData(this.keyService.USER_TYPE);
  }

  create(feeType: FeeType) {
    return lastValueFrom(this.feeTypeService.create(feeType));
  }

  createFeeType() {
    this.busy = true;

    this.model.name = this.form.get('name')?.value!;
    this.model.amount = this.form.get('amount')!.value!;
    this.model.description = this.form.get('description')!.value!;
    this.model.actionBy = this.adminCode;

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
