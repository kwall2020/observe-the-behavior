import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { ApiService } from '../../services/api.service';
import { AvailabilityState } from '../../store/availability/availability.state';
import * as AvailabilityAction from '../../store/availability/availability.action';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {
  token: string = null;
  startDate: Date;
  data$: Observable<object>;
  errorStatus: string;
  errorStatusText: string;

  constructor(
    private apiService: ApiService,
    private store: Store<AvailabilityState>
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.data$ = this.store.select(state => state.data);
  }

  getNewToken() {
    this.apiService
      .token()
      .subscribe((json) => {
        this.token = json.data.token;
        localStorage.setItem('token', this.token);
        this.errorStatus = '';
        this.errorStatusText = '';
      });
  }

  getFlights() {
    this.store.dispatch(new AvailabilityAction.GetFlights({
      startDate: this.startDate
    }));
  }
}
