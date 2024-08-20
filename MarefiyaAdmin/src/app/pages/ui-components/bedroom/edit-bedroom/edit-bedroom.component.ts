import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BedRoom } from 'src/app/model/bedroom/bedroom.model';
import { BedroomService } from '../bedroom.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-bedroom',
  templateUrl: './edit-bedroom.component.html',
  styleUrl: './edit-bedroom.component.scss'
})
export class EditBedroomComponent {
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  model: BedRoom = new BedRoom();
  bedroom!: BedRoom;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    quantity: new FormControl(0, [Validators.required]),
  });

  constructor(
    private bedroomService: BedroomService,
    private toastService: ToastService,
    private messageService: MessageService,
    private keyService: KeyService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.bedroom = this.storageService.getData(this.keyService.BEDROOM_OBJCT_KEY);
    this.populateData(this.bedroom);
  }

  populateData(arg: BedRoom) {
    this.form.get('name')?.setValue(arg.name);
    this.form.get('quantity')?.setValue(arg.quantity);
  }

  edit(bedroom: BedRoom) {
    return lastValueFrom(this.bedroomService.update(bedroom));
  }

  editBedroom() {
    this.busy = true;

    this.model.id = this.bedroom.id;
    this.model.name = this.form.get('name')?.value!;
    this.model.quantity = this.form.get('quantity')!.value!;

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
