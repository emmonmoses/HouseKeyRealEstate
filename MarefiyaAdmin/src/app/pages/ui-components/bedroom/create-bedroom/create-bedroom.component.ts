import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BedRoom } from 'src/app/model/bedroom/bedroom.model';
import { BedroomService } from '../bedroom.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { RoleService } from 'src/app/pages/authentication/role/role.service';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-bedroom',
  templateUrl: './create-bedroom.component.html',
  styleUrl: './create-bedroom.component.scss'
})
export class CreateBedroomComponent {
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  selectedRoleId?: string;
  model: BedRoom = new BedRoom();
  adminCode!: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    quantity: new FormControl(0, [Validators.required]),
  });

  constructor(
    private bedroomService: BedroomService,
    private toastService: ToastService,
    private messageService: MessageService,
    private roleService: RoleService,
    private keyService: KeyService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.adminCode = this.storageService.getData(this.keyService.USER_TYPE);
  }

  create(bedroom: BedRoom) {
    return lastValueFrom(this.bedroomService.create(bedroom));
  }

  createBedroom() {
    this.busy = true;

    this.model.name = this.form.get('name')?.value!;
    this.model.quantity = this.form.get('quantity')!.value!;
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
