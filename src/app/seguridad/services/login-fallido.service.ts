import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginFallido } from '../entity/login-fallido';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginFallidoService {

  private urlEndPoint: string;

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlSecurity + '/api/loginAttempts';
  }

  getLoginFallidos() : Observable<LoginFallido[]> {
      return this.http.get<LoginFallido[]>(this.urlEndPoint + '/');
  }

  getLoginFallidosFilter(loginFallido: LoginFallido) : Observable<LoginFallido[]> {
      return this.http.put<LoginFallido[]>(this.urlEndPoint + '/find', loginFallido);
  }

  getIpsBloqueadas() : Observable<any> {
    return this.http.get<any>(this.urlEndPoint + '/ip');
  }

  removeIpsBloqueadas(ip: string): Observable<any> {
    return this.http.delete(this.urlEndPoint + '/ip/' + ip, undefined);
  }

}
