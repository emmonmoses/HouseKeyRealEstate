import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { lastValueFrom } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { TripTypeCreate } from 'src/app/model/trip-type/trip-type-create.mode';
import { TripTypeService } from '../trip-type.service';

@Component({
  selector: 'app-trip-type-create',
  templateUrl: './trip-type-create.component.html',
  styleUrl: './trip-type-create.component.scss',
})
export class TripTypeCreateComponent implements OnInit {
  [x: string]: any;

  model: TripTypeCreate = new TripTypeCreate();
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  userType!: string;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    status: new FormControl(1, [Validators.required]),
    actionBy: new FormControl('', [Validators.required]),
  });

  constructor(
    private tripTypeService: TripTypeService,
    private toastService: ToastService,
    private messageService: MessageService,
    private keyService: KeyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
  }

  create(tripType: TripTypeCreate) {
    return lastValueFrom(this.tripTypeService.createTripType(tripType));
  }

  createTripType() {
    this.model.name = this.form.get('name')!.value!;
    this.model.status = Number(this.form.get('status')!.value!);
    this.model.actionBy = this.userType;

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
