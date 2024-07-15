import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { lastValueFrom } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { LocationCreate } from 'src/app/model/locations/location-create.model';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrl: './create-location.component.scss',
})
export class CreateLocationComponent implements OnInit {
  [x: string]: any;

  model: LocationCreate = new LocationCreate();
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  userType!: string;

  form = new FormGroup({
    city: new FormControl('', [Validators.required]),
    subcity: new FormControl('', Validators.required),
    woreda: new FormControl('', [Validators.required]),
    status: new FormControl(true, [Validators.required]),
    actionBy: new FormControl('', [Validators.required]),
  });

  constructor(
    private locationService: LocationService,
    private toastService: ToastService,
    private messageService: MessageService,
    private keyService: KeyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
  }

  create(location: LocationCreate) {
    return lastValueFrom(this.locationService.createLocation(location));
  }

  createLocation() {
    this.busy = true;
    this.model.city = this.form.get('city')?.value!;
    this.model.subcity = this.form.get('subcity')!.value!;
    this.model.woreda = this.form.get('woreda')!.value!;
    this.model.status = this.form.get('status')!.value!;
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
