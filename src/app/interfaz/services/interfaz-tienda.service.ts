import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroDto } from '../dto/filtro-dto';

@Injectable({
  providedIn: 'root'
})
export class InterfazTiendaService {

  private urlEndPoint: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlInterfaz;
  }

  getResultadosProcesoInterfaz(dto: FiltroDto): Observable<FiltroDto[]> {
    return this.http.post<any>(`${this.urlEndPoint}/api/interface/ejecutainterfaces`, dto);
  }

}
