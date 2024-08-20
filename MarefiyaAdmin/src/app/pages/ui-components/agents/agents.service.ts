import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { AgentResponse } from 'src/app/model/agent/agent-response.model';
import { Agent } from 'src/app/model/agent/agent.model';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class AgentsService extends BaseService {

  httpOptions: any;
  token: any;
  subscription: Subscription | any;

  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private protectedService: ProtectedService,
    private authService: AuthService
  ) {
    super();
    this.token = this.authService.getToken;
    this.httpOptions = this.protectedService.getHttpOptions(this.token);
  }

  getAll(): Observable<AgentResponse> {
    return this.http
      .get(`${this.resEndpoint.GetAgentUri}`, this.httpOptions)
      .pipe(
        map((response: AgentResponse) => response),
        catchError(this.handleError)
      );
  };

  create(agent: Agent): Observable<Agent> {
    return this.http
      .post(this.resEndpoint.GetAgentUri, agent, this.httpOptions)
      .pipe(
        map((response: Agent) => response),
        catchError(this.handleError)
      );
  };

  update(agent: Agent): Observable<Agent> {
    return this.http
      .patch(`${this.resEndpoint.GetAgentUri}`, agent, this.httpOptions)
      .pipe(
        map((response: Agent) => response),
        catchError(this.handleError)
      );
  };

  delete(agentId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetAgentUri}/${agentId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
