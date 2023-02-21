import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { environment } from 'src/environments/environment';
import { ParamDto } from '../dto/param-dto';
import { Tienda } from '../entity/tienda';

@Injectable({
  providedIn: 'root'
})
export class EjecutarService {

  private urlEndPoint: string;
  private urlEndPointSybase: string;

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
    this.urlEndPoint = environment.urlEjecutor;
    this.urlEndPointSybase = environment.urlEjecutorSybase;
  }

  getAll(): Observable<Tienda[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/tienda/${idEmpresa}`);
  }

  ejecutarConsultaMySql(dto: ParamDto): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/api/ejecutar/consulta`, dto);
  }

  ejecutarTransaccionMySql(dto: ParamDto): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/api/ejecutar/transaccion`, dto);
  }

  ejecutarConsultaSybase(dto: ParamDto): Observable<any> {
    return this.http.put<any>(`${this.urlEndPointSybase}/api/ejecutar/consulta`, dto);
  }

  ejecutarTransaccionSybase(dto: ParamDto): Observable<any> {
    return this.http.put<any>(`${this.urlEndPointSybase}/api/ejecutar/transaccion`, dto);
  }

}
