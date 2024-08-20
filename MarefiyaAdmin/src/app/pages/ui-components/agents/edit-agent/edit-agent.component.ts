import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Agent } from 'src/app/model/agent/agent.model';
import { Role } from 'src/app/model/role/role.model';
import { AgentsService } from '../agents.service';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { RoleService } from 'src/app/pages/authentication/role/role.service';
import { KeyService } from 'src/app/services/key.service';
import { StorageService } from 'src/app/services/storage.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RoleResponse } from 'src/app/model/role/role-response.model';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrl: './edit-agent.component.scss'
})
export class EditAgentComponent {
  busy: boolean = false;
  roles?: Role[];
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  selectedRoleId?: string;
  model: Agent = new Agent();
  adminCode!: string;
  agent!: Agent;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    username: new FormControl('', [Validators.required, Validators.email]),
    roleId: new FormControl('', [Validators.required]),
    status: new FormControl(false, [Validators.required]),
  });

  constructor(
    private agentsService: AgentsService,
    private toastService: ToastService,
    private messageService: MessageService,
    private roleService: RoleService,
    private keyService: KeyService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.getAllRole();
    this.adminCode = this.storageService.getData(this.keyService.USER_TYPE);
    this.agent = this.storageService.getData(this.keyService.AGENT_OBJECT_KEY);
  }

  populateData(arg: Agent) {
    this.form.get('name')?.setValue(arg.name);
    this.form.get('username')?.setValue(arg.email);
    this.form.get('status')?.setValue(arg.status);
    for (let i = 0; i < this.roles!.length; i++) {
      if (this.roles![i].name == arg.role) {
        this.form.get('roleId')?.setValue(this.roles![i].id);
        this.selectedRoleId = this.roles![i].id;
      }
    }
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
            this.populateData(this.agent);
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

  edit(agent: Agent) {
    return lastValueFrom(this.agentsService.update(agent));
  }

  editAgent() {
    this.busy = true;

    this.model.id = this.agent.id;
    this.model.name = this.form.get('name')?.value!;
    this.model.username = this.form.get('username')!.value!;
    this.model.status = this.form.get('status')!.value!;
    this.model.roleId = this.selectedRoleId ?? '';
    this.model.actionBy = this.adminCode;

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
