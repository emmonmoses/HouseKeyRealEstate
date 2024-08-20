import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeeType } from 'src/app/model/fee-type/fee-type.model';
import { FeeTypeService } from '../fee-type.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-fee-type',
  templateUrl: './edit-fee-type.component.html',
  styleUrl: './edit-fee-type.component.scss'
})
export class EditFeeTypeComponent {
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  model: FeeType = new FeeType();
  feeType!: FeeType;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    amount: new FormControl(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(
    private feeTypeService: FeeTypeService,
    private toastService: ToastService,
    private messageService: MessageService,
    private keyService: KeyService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.feeType = this.storageService.getData(this.keyService.FEETYPE_OBJECT_KEY);
    this.populateData(this.feeType);
  }

  populateData(arg: FeeType) {
    this.form.get('name')?.setValue(arg.name);
    this.form.get('amount')?.setValue(arg.amount);
    this.form.get('description')?.setValue(arg.description!);
  }

  edit(feeType: FeeType) {
    return lastValueFrom(this.feeTypeService.update(feeType));
  }

  editFeeType() {
    this.busy = true;

    this.model.id = this.feeType.id;
    this.model.name = this.form.get('name')?.value!;
    this.model.amount = this.form.get('amount')!.value!;
    this.model.description = this.form.get('description')!.value!;

    this.edit(this.model)
      .then(
        (result) => {
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
}
