import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/model/role/role.model';
import { AgentsService } from '../agents.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { RoleService } from 'src/app/pages/authentication/role/role.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RoleResponse } from 'src/app/model/role/role-response.model';
import { Agent } from 'src/app/model/agent/agent.model';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrl: './create-agent.component.scss'
})
export class CreateAgentComponent {
  busy: boolean = false;
  roles?: Role[];
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  selectedRoleId?: string;
  model: Agent = new Agent();
  adminCode!: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    roleId: new FormControl('', [Validators.required]),
    status: new FormControl(false, [Validators.required]),
  });

  constructor(
    private agentsService: AgentsService,
    private toastService: ToastService,
    private messageService: MessageService,
    // private location: Location,
    private roleService: RoleService,
    private keyService: KeyService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.getAllRole();
    this.adminCode = this.storageService.getData(this.keyService.USER_TYPE);
  }

  onRoleChange(event: any) {
    const role = event.value;
    this.selectedRoleId = role;
  }

  public getRole(): Promise<any> {
    return firstValueFrom(this.roleService.getRoles(this.page, this.pageSize));
  }

  getAllRole(): void {
    this.busy = true;
    this.getRole()
      .then(
        (result: RoleResponse) => {
          if (!result.data || result.data.length === 0) {
            this.toastService.error('No Roles Found');
          } else {
            this.roles = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          }
        },
        (error) => {
          this.toastService.error(this.messageService.serverError);
        }
      )
      .finally(() => {
        this.busy = false;
      });
  }

  create(agent: Agent) {
    return lastValueFrom(this.agentsService.create(agent));
  }

  createAgent() {
    this.busy = true;

    this.model.name = this.form.get('name')?.value!;
    this.model.username = this.form.get('username')!.value!;
    this.model.password = this.form.get('password')!.value!;
    this.model.status = this.form.get('status')!.value!;
    this.model.roleId = this.selectedRoleId ?? '';
    this.model.actionBy = this.adminCode;

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
