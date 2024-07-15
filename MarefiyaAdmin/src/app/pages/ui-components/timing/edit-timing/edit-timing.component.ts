import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { Location } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { Timing } from 'src/app/model/timing/timing.model';
import { TimingService } from '../timing.service';

@Component({
  selector: 'app-edit-timing',
  templateUrl: './edit-timing.component.html',
  styleUrl: './edit-timing.component.scss',
})
export class EditTimingComponent implements OnInit {
  timing!: Timing;
  model: Timing = new Timing();
  number!: number;
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  userType!: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    status: new FormControl(1, [Validators.required]),
    actionBy: new FormControl('', [Validators.required]),
  });

  constructor(
    private timingService: TimingService,
    private toastService: ToastService,
    private messageService: MessageService,
    private location: Location,
    private keyService: KeyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.busy = true;
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.timing = this.storageService.getData(this.keyService.TIMING_KEY);
    this.populateData(this.timing);
    this.busy = false;
  }

  populateData(arg: Timing) {
    this.form.get('name')?.setValue(arg.name);
    this.form.get('status')?.setValue(arg.status);
  }

  update(timing: Timing) {
    return lastValueFrom(this.timingService.updateTiming(timing));
  }

  updateTiming() {
    this.busy = true;

    this.model.name = this.form.get('name')?.value!;
    this.model.status = this.form.get('status')!.value!;
    this.model.actionBy = this.userType;
    this.model.id = this.timing.id;

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
