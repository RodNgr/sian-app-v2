import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Proceso } from '../entity/proceso';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  private urlEndPoint!: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlCuadratura;
  }

  findProcesos(tiProceso: number, feInicio: string, feFin: string): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(`${this.urlEndPoint}/api/cuadratura/${tiProceso}/${feInicio}/${feFin}`);
  }

  addProceso(proceso: Proceso): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/cuadratura`, proceso);
  }

  uploadFile(archivo: File): Observable<any> {
    let formData = new FormData();
    formData.append("file", archivo);

    return this.http.post<any>(`${this.urlEndPoint}/api/cuadratura/upload/`, formData);
  }

  reprocesar(proceso: Proceso): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/cuadratura/reprocesar/${proceso.idProceso}`, proceso);
  }

}
