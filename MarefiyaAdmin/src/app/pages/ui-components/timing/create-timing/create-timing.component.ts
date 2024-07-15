import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { lastValueFrom } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { TimingCreate } from 'src/app/model/timing/timing-create.model';
import { TimingService } from '../timing.service';

@Component({
  selector: 'app-create-timing',
  templateUrl: './create-timing.component.html',
  styleUrl: './create-timing.component.scss',
})
export class CreateTimingComponent implements OnInit {
  [x: string]: any;

  model: TimingCreate = new TimingCreate();
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
    private keyService: KeyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
  }

  create(timing: TimingCreate) {
    return lastValueFrom(this.timingService.createTiming(timing));
  }

  createTiming() {
    this.busy = true;
    this.model.name = this.form.get('name')?.value!;
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
