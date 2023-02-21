import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientCyber } from '../entity/client-cyber';

@Injectable({
  providedIn: 'root'
})
export class CyberService {

  constructor(private http: HttpClient) { }

  getClients(startDate: string, endDate: string): Observable<ClientCyber[]> {
    return this.http.get<ClientCyber[]>(`https://api-ngr.com/multi-marca/search-client-date?startDate=${startDate}&endDate=${endDate}`);
  }

}
