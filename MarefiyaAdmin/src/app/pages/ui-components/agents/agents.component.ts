import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { KeyService } from 'src/app/services/key.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentsService } from './agents.service';
import { lastValueFrom } from 'rxjs';
import { Agent } from 'src/app/model/agent/agent.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agents',
  // standalone: true,
  // imports: [],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent {
  hidden = false;
  pages: number[] = [];
  agents?: Agent[];
  agent?: Agent;
  userType!: string;
  page: number = 1;
  pageSize: number = 10;
  busy: boolean = true;

  @ViewChild('viewModal') viewModal: any;
  constructor(
    private agentsService: AgentsService,
    private toastService: ToastService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private keyService: KeyService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllAgents();
  }

  getAllAgents() {
    this.busy = true;
    return lastValueFrom(this.agentsService.getAll())
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.agents = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.agents = [];
            this.toastService.error('No Agent Found');
          }
        },
        (error) => {
          this.toastService.error('No Agent Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Agents:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  view(agent: Agent) {
    this.agent = agent;
    this.modalService
      .open(this.viewModal, { ariaLabelledBy: 'viewModalLabel' })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  edit(agent: Agent) {
    this.route.navigate(['/ui-components/edit-agent']);
    this.storageService.setData(this.keyService.AGENT_OBJECT_KEY, agent);
  }

  deleteAgent(agentId: string, adminCode: string) {
    return lastValueFrom(
      this.agentsService.delete(agentId, adminCode)
    );
  };

  delete(agent: Agent) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.busy = true;
        this.deleteAgent(agent.id!, this.userType)
          .then(
            (result) => {
              this.agents = this.agents?.filter(
                (ag) => ag !== agent
              );
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
    });
  }
}
