import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { Location } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { VehiclesService } from '../vehicles.service';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss',
})
export class EditVehicleComponent implements OnInit {
  vehicle!: Vehicle;
  model: Vehicle = new Vehicle();
  number!: number;
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  userType!: string;

  form = new FormGroup({
    vehicleType: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    vehicleCapacity: new FormControl(0, [Validators.required]),
    vehicleRegistration: new FormControl('', Validators.required),
    vehicleModel: new FormControl('', [Validators.required]),
    status: new FormControl(true, [Validators.required]),
    actionBy: new FormControl('', [Validators.required]),
  });

  constructor(
    private vehiclesService: VehiclesService,
    private toastService: ToastService,
    private messageService: MessageService,
    private location: Location,
    private keyService: KeyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.busy = true;
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.vehicle = this.storageService.getData(
      this.keyService.VEHICLEOBJECT_KEY
    );
    this.populateData(this.vehicle);
    this.busy = false;
  }

  populateData(arg: Vehicle) {
    this.form.get('vehicleType')?.setValue(arg.vehicleType);
    this.form.get('vehicleCapacity')?.setValue(arg.vehicleCapacity ?? null);
    this.form.get('vehicleRegistration')?.setValue(arg.vehicleRegistration);

    this.form.get('vehicleModel')?.setValue(arg.vehicleModel);
    this.form.get('status')?.setValue(arg.status);
  }

  update(vehicle: Vehicle) {
    return lastValueFrom(this.vehiclesService.updateVehicle(vehicle));
  }

  updateVehicle() {
    this.busy = true;

    this.model.vehicleType = this.form.get('vehicleType')?.value!;
    this.model.vehicleCapacity = this.form.get('vehicleCapacity')!.value!;
    this.model.vehicleRegistration = this.form.get(
      'vehicleRegistration'
    )?.value!;
    this.model.vehicleModel = this.form.get('vehicleModel')!.value!;
    this.model.status = this.form.get('status')!.value!;
    this.model.actionBy = this.userType;
    this.model.id = this.vehicle.id;

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
