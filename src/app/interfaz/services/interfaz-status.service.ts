import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroDto } from '../dto/filtro-dto';
import { ResultadoDto } from '../dto/resultado-dto';
import { InterfaceEjecucionLog } from '../entity/interface-ejecucion-log';
import { InterfazStatus } from '../entity/interfaz-status';

@Injectable({
  providedIn: 'root'
})
export class InterfazStatusService {

  private urlEndPoint: string

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlInterfaz;
  }

  getResumen(dto: FiltroDto): Observable<ResultadoDto> {
      return this.http.post<ResultadoDto>(`${this.urlEndPoint}/api/status/resumen`, dto); 
  }

  getIncidentesInterfaces(idEmpresa: number, inicio: string, fin: string, tipo: string, estado: string): Observable<InterfazStatus[]> {
      return this.http.get<InterfazStatus[]>(`${this.urlEndPoint}/api/status/incidente/${idEmpresa}/${inicio}/${fin}/${tipo}/${estado}`);
  }

  getIncidentesDetalle(idEjecucion: number): Observable<InterfaceEjecucionLog[]> {
    return this.http.get<InterfaceEjecucionLog[]>(`${this.urlEndPoint}/api/status/incidente/detalle/${idEjecucion}`);
  }
  
}
