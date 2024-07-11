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
  private urlEndPointArticulo: string;
  private urlEndPointBB: string;
  private urlEndPointDB: string;
  private urlEndPointPP: string;
  private urlEndPointCW: string;
  private urlEndPointPJ: string;
  private urlEndPointDD: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlInterfaz;
    this.urlEndPointArticulo = environment.urlInterfazProducto;
    this.urlEndPointBB = environment.urlInterfazBB;
    this.urlEndPointDB = environment.urlInterfazDB;
    this.urlEndPointPP = environment.urlInterfazPP;
    this.urlEndPointCW = environment.urlInterfazCW;
    this.urlEndPointPJ = environment.urlInterfazPJ;
    this.urlEndPointDD = environment.urlInterfazDD;
  }

  getResultadosProcesoInterfaz(dto: FiltroDto): Observable<FiltroDto[]> {
    return this.http.post<any>(`${this.urlEndPoint}/api/interface/ejecutainterfaces`, dto);
  }

  insertarLogStatus(logInterfaz: InterfazLog): Observable<any>{
    return this.http.post<any>(`${this.urlEndPoint}/api/interface/insertarLogInterfaces`, logInterfaz);
  }

  getResultadosProcesoInterfazNew(dto: FiltroDto, marca: number): Observable<FiltroDto[]> {
    let servicio = this.urlEndPoint;
    if (marca == 2) servicio = this.urlEndPointBB;
    else if (marca == 3) servicio = this.urlEndPointDB;
    else if (marca == 4) servicio = this.urlEndPointPP;
    else if (marca == 5) servicio = this.urlEndPointCW;
    else if (marca == 7) servicio = this.urlEndPointPJ;
    else if (marca == 8) servicio = this.urlEndPointDD;
    return this.http.post<any>(`${servicio}/api/interface/ejecutainterfacesnew`, dto);    
  }

  insertarLogStatusNew(logInterfaz: InterfazLog, marca: number): Observable<any>{
    let servicio = this.urlEndPoint;
   /*  if (marca == 2) servicio = this.urlEndPointBB;
    else if (marca == 3) servicio = this.urlEndPointDB;
    else if (marca == 4) servicio = this.urlEndPointPP;
    else if (marca == 5) servicio = this.urlEndPointCW;
    else if (marca == 7) servicio = this.urlEndPointPJ;
    else if (marca == 8) servicio = this.urlEndPointDD; */
    return this.http.post<any>(`${servicio}/api/interface/insertarLogInterfaces`, logInterfaz);
  }

  verificarLogStatusNew(logInterfaz: InterfazLog, marca: number): Observable<any>{
    let servicio = this.urlEndPoint;
    if (marca == 2) servicio = this.urlEndPointBB;
    else if (marca == 3) servicio = this.urlEndPointDB;
    else if (marca == 4) servicio = this.urlEndPointPP;
    else if (marca == 5) servicio = this.urlEndPointCW;
    else if (marca == 7) servicio = this.urlEndPointPJ;
    else if (marca == 8) servicio = this.urlEndPointDD;
    return this.http.post<any>(`${servicio}/api/interface/verificarLogInterfaces`, logInterfaz);
  }

  getflagServiciosMultiples(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPointArticulo}/api/interfaz-articulo/flagServiciosMultiples`);
  }
}
