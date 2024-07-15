import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { Location } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { Locations } from 'src/app/model/locations/location.model';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrl: './edit-location.component.scss',
})
export class EditLocationComponent {
  loc!: Locations;
  model: Locations = new Locations();
  number!: number;
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
    private storageService: StorageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.busy = true;
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.loc = this.storageService.getData(this.keyService.LOCATION_kEY);
    this.populateData(this.loc);
    this.busy = false;
  }

  populateData(arg: Locations) {
    this.form.get('city')?.setValue(arg.city);
    this.form.get('subcity')?.setValue(arg.subcity);
    this.form.get('woreda')?.setValue(arg.woreda);
    this.form
      .get('status')
      ?.setValue(arg.status === undefined ? null : Boolean(arg.status));
  }

  update(location: Locations) {
    return lastValueFrom(this.locationService.updateLocation(location));
  }

  updateLocation() {
    this.busy = true;

    this.model.city = this.form.get('city')?.value!;
    this.model.subcity = this.form.get('subcity')!.value!;
    this.model.woreda = this.form.get('woreda')!.value!;
    this.model.status = this.form.get('status')!.value!;
    this.model.actionBy = this.userType;
    this.model.id = this.loc.id;

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
