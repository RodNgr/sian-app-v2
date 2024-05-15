import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroDto } from '../dto/filtro-dto';
import { InterfazLog } from '../entity/logInterfaz';

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

  insertarLogStatus(logInterfaz: InterfazLog): Observable<any>{
    return this.http.post<any>(`${this.urlEndPoint}/api/interface/insertarLogInterfaces`, logInterfaz);
  }

  getResultadosProcesoInterfaz2(dto: FiltroDto, marca: number): Observable<FiltroDto[]> {
    let servicio = this.urlEndPoint;
    if (marca == 2) servicio = environment.urlInterfazBB;
      else if (marca == 3) servicio = environment.urlInterfazDB;
      else if (marca == 4) servicio = environment.urlInterfazPP;
      else if (marca == 5) servicio = environment.urlInterfazCW;
      else if (marca == 7) servicio = environment.urlInterfazPJ;
      else if (marca == 8) servicio = environment.urlInterfazDD;
      //return this.http.post<any>(`${servicio}/api/interface/ejecutainterfaces`, dto);
      return this.http.post<any>(`${servicio}/api/interface/ejecutainterfacesnew`, dto);    
  }

  insertarLogStatus2(logInterfaz: InterfazLog): Observable<any>{
    return this.http.post<any>(`${this.urlEndPoint}/api/interface/insertarLogInterfaces`, logInterfaz);
  }

  verificarLogStatus2(logInterfaz: InterfazLog): Observable<any>{
    return this.http.post<any>(`${this.urlEndPoint}/api/interface/verificarLogInterfaces`, logInterfaz);
  }
}
