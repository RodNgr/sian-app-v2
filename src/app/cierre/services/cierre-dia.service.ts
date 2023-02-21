import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CierreDto } from '../dto/cierre-dto';
import { Observable } from 'rxjs';
import { Cierre } from '../entity/cierre';
import { CierreOtro } from '../entity/cierre-otro';
import { Deposito } from '../entity/deposito';
import { DepositoDto } from '../dto/deposito-dto';
import { Banco } from '../entity/banco';
import { Moneda } from '../entity/moneda';
import { TiendaConfiguracionBanco } from '../entity/tiendaConfiguracionBanco';
import { Employee } from '../entity/employee';

@Injectable({
  providedIn: 'root'
})
export class CierreDiaService {

  private urlEndPoint: string;

  constructor(private http: HttpClient) { 
    this.urlEndPoint = environment.urlCierre;
  }

  getCierreDia(dto: CierreDto): Observable<Cierre> {
    return this.http.post<Cierre>(`${this.urlEndPoint}/api/cierredia/listas`, dto);
  }

  saveDia(cierre: Cierre): Observable<Cierre> {
    return this.http.post<Cierre>(`${this.urlEndPoint}/api/cierredia/saveDia`, cierre);
  }

  openDia(cierre: Cierre): Observable<Cierre> {
    return this.http.post<Cierre>(`${this.urlEndPoint}/api/cierredia/openDia`, cierre);
  }

  closeDia(cierre: Cierre): Observable<Cierre> {
    return this.http.post<Cierre>(`${this.urlEndPoint}/api/cierredia/closeDia`, cierre);
  }

  cleanDia(cierre: Cierre): Observable<Cierre> {
    return this.http.post<Cierre>(`${this.urlEndPoint}/api/cierredia/cleanDia`, cierre);
  }

  deleteCuadratura(cierre: Cierre): Observable<Cierre> {
    return this.http.post<Cierre>(`${this.urlEndPoint}/api/cierredia/deleteCuadratura`, cierre);
  }

  getDepositos(dto: DepositoDto): Observable<Deposito[]> {
    return this.http.post<Deposito[]>(`${this.urlEndPoint}/api/cierredia/getDeposito`, dto);
  }

  getBancos(dto: CierreDto): Observable<Banco[]> {
    return this.http.post<Banco[]>(`${this.urlEndPoint}/api/cierredia/getBancos`, dto);
  }

  getMonedas(dto: CierreDto): Observable<Moneda[]> {
    return this.http.post<Moneda[]>(`${this.urlEndPoint}/api/cierredia/getMonedas`, dto);
  }

  getCuentasBancarias(dto: CierreDto): Observable<TiendaConfiguracionBanco[]> {
    return this.http.post<TiendaConfiguracionBanco[]>(`${this.urlEndPoint}/api/cierredia/getCuentasBancarias`, dto);
  }

  saveDeposito(deposito: Deposito): Observable<number> {
    return this.http.post<number>(`${this.urlEndPoint}/api/cierredia/saveDeposito`, deposito);
  }

  getDepositosPorTienda(dto: CierreDto): Observable<Deposito[]> {
    return this.http.post<Deposito[]>(`${this.urlEndPoint}/api/cierredia/getDepositosPorTienda`, dto);
  }

  deleteDeposito(deposito: Deposito): Observable<number> {
    return this.http.post<number>(`${this.urlEndPoint}/api/cierredia/deleteDeposito`, deposito);
  }

  loadResponsableSybase(idEmpresa: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.urlEndPoint}/api/cierredia/loadResponsableSybase/${idEmpresa}`);
  }

  saveCierreOtro(otro: CierreOtro): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/cierredia/saveCierreOtro`, otro);
  }
}
