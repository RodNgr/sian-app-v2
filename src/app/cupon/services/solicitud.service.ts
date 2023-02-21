import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { Solicitud } from '../entity/solicitud';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlCupones;
  }

  getSolicitudes(inicio: string, fin: string): Observable<Solicitud[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<Solicitud[]>(`${this.urlEndPoint}/api/solicitud/${idEmpresa}/${inicio}/${fin}`);
  }

  getSolicitud(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.urlEndPoint}/api/solicitud/${id}`);
  }

  createSolicitud(solicitud: Solicitud): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/solicitud`, solicitud);
  }

  reenviar(idSolicitud: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/api/solicitud/mail/${idSolicitud}`);
  }

  assignDiem(solicitud: Solicitud): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/api/solicitud/diem/`, solicitud);
  }

  assignPrefijo(solicitud: Solicitud): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/api/solicitud/prefijo/`, solicitud);
  }

  anular(solicitud: Solicitud): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/api/solicitud/anula/`, solicitud);
  }

}
