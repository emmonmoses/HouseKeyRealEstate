import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LogIn } from 'src/app/model/LogIn/LogIn.model';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { KeyService } from 'src/app/services/key.service';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { lastValueFrom } from 'rxjs';
import { BroadcastMessage } from 'src/app/model/broadcast-message';
import { LogInService } from './LogIn.service';

@Component({
  selector: 'app-LogIn',
  templateUrl: './LogIn.component.html',
})
export class AppSideLogInComponent {
  model!: LogIn;

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private LogInService: LogInService,
    private storageService: StorageService,
    private toastService: ToastService,
    private messageService: MessageService,
    private keyService: KeyService,
    private broadcastService: BroadcastService
  ) {}

  formSubmit(f: NgForm) {
    this.router.navigate(['/']);
  }

  LogIn(LogIn: LogIn) {
    return lastValueFrom(this.LogInService.LogIn(LogIn));
  }

  save() {
    this.model = this.form.value as LogIn;

    if (
      this.model.username.trim() === '' &&
      this.model.password.trim() === ''
    ) {
      console.error('Username and password are required.');
      // Display an error message to the user, or handle it as needed.
      this.toastService.error('Email and password are required.');
      return;
    }
    if (this.model.username.trim() === '') {
      this.toastService.error('Email required.');
      return;
    }

    if (this.model.password.trim() === '') {
      this.toastService.error(' password  required.');
      return;
    }

    this.LogIn(this.model)
      .then((result) => {
        if (result.id) {
          this.storageService.setData(
            this.keyService.TOKEN_KEY,
            result.authorization.token
          );
          this.storageService.setData(
            this.keyService.EMAIL_KEY,
            result.username
          );
          this.storageService.setData(this.keyService.USER_TYPE, result.admin);
          this.storageService.setData(
            this.keyService.USER_NAME_KEY,
            result.name
          );
          // this.storageService.setData(
          //   this.keyService.AVATAR_KEY,
          //   result.avatar
          // );
          this.storageService.setData(
            this.keyService.CLAIMS_KEY_ROW,
            result.permissions
          );
          this.broadcastService.broadcastTask(
            new BroadcastMessage('isLoggedIn', true)
          );

          let claims = result.permissions.reduce((acc, currentValue) => {
            acc[currentValue] = true;
            return acc;
          }, {});
          this.storageService.setData(this.keyService.CLAIMS_KEY, claims);
          this.router.navigate(['dashboard']);
          this.toastService.success(this.messageService.LogInSuccess);
        }
        // additional success handling if needed
      })
      .catch((reject) => {
        console.error('Unsuccessful LogIn:', reject);
        // additional error handling if needed
        this.toastService.error(this.messageService.LogInError);
      })
      .finally(() => {
        // any cleanup or finalization code
      });
  }
}
