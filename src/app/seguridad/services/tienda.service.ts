import { Injectable } from '@angular/core';
import { Tienda } from '../entity/tienda';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  private urlEndPoint: string

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlInterfaz;
  }

  getTiendas(idEmpresa: number): Observable<Tienda[]> {
      return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/tienda/${idEmpresa}`);
  }

  getTiendasPorEmpresa(idEmpresa: number, usuario: string): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/tienda/getTiendasPorEmpresa/${idEmpresa}/${usuario}`);
  }
}
