import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Device } from '../entity/device';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private urlEndPoint: string;

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlSecurity + '/api/devices';
  }

  getDevices(id: string): Observable<Device[]> {
      return this.http.get<Device[]>(`${this.urlEndPoint}/${id}`);
  }

}
