import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { lastValueFrom } from 'rxjs';
import { VehiclesService } from '../vehicles.service';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { VehicleCreate } from 'src/app/model/Vehicles/vehicle-create.model';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.scss',
})
export class CreateVehicleComponent implements OnInit {
  [x: string]: any;

  model: VehicleCreate = new VehicleCreate();
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
    private keyService: KeyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
  }

  create(vehicle: VehicleCreate) {
    return lastValueFrom(this.vehiclesService.createVehicle(vehicle));
  }

  createVehicle() {
    this.busy = true;
    this.model.vehicleType = this.form.get('vehicleType')?.value!;
    this.model.vehicleCapacity = this.form.get('vehicleCapacity')!.value!;
    this.model.vehicleRegistration = this.form.get(
      'vehicleRegistration'
    )!.value!;
    this.model.vehicleModel = this.form.get('vehicleModel')!.value!;
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
