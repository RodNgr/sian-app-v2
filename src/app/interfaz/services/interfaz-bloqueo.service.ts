import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroDto } from '../dto/filtro-dto';
import { InterfazBloqueo } from '../entity/interfaz-bloqueo';

@Injectable({
  providedIn: 'root'
})
export class InterfazBloqueoService {

  private urlEndPoint: string

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlInterfaz;
  }

  getResumen(dto: FiltroDto): Observable<InterfazBloqueo[]> {
    return this.http.post<InterfazBloqueo[]>(`${this.urlEndPoint}/api/bloqueo/resumen`, dto); 
  }
  
  save(dto: FiltroDto): Observable<string[]> {
    return this.http.post<string[]>(`${this.urlEndPoint}/api/bloqueo/`, dto); 
  }

  liberar(dto: FiltroDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/bloqueo/liberar`, dto); 
  }

}
