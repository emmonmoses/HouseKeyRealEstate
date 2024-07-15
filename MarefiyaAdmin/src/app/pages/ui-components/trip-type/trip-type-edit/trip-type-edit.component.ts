import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { Location } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { TripType } from 'src/app/model/trip-type/trip-type.model';
import { TripTypeService } from '../trip-type.service';

@Component({
  selector: 'app-trip-type-edit',
  templateUrl: './trip-type-edit.component.html',
  styleUrl: './trip-type-edit.component.scss',
})
export class TripTypeEditComponent implements OnInit {
  tripType!: TripType;
  model: TripType = new TripType();
  number!: number;
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
    private location: Location,
    private keyService: KeyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.busy = true;
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.tripType = this.storageService.getData(this.keyService.TRIPTYPE_KEY);
    this.populateData(this.tripType);
    this.busy = false;
  }

  populateData(arg: TripType) {
    this.form.get('name')?.setValue(arg.name);
    this.form.get('status')?.setValue(arg.status);
  }

  update(tripType: TripType) {
    return lastValueFrom(this.tripTypeService.updateTripType(tripType));
  }

  updateTripType() {
    this.busy = true;

    this.model.name = this.form.get('name')?.value!;
    this.model.status = this.form.get('status')!.value!;
    this.model.actionBy = this.userType;
    this.model.id = this.tripType.id;

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
