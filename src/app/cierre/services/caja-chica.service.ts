import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CierreOtroDto } from '../dto/cierre-otro-dto';
import { CierreOtro } from '../entity/cierre-otro';

@Injectable({
  providedIn: 'root'
})
export class CajaChicaService {

  private urlEndPoint: string

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlCierre;
  }

  getCierreOtraCierreCaja(dto: CierreOtroDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/caja-chica/lista`, dto);
  }

  cajaChicaUsada(otro: CierreOtro): Observable<boolean> {
    return this.http.post<boolean>(`${this.urlEndPoint}/api/caja-chica/cajaChicaUsada`, otro);
  }

  updateEstadoCajaChica(otro: CierreOtro): Observable<boolean> {
    return this.http.post<boolean>(`${this.urlEndPoint}/api/caja-chica/updateEstadoCajaChica`, otro);
  }

  saveCajaChica(otro: CierreOtro): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/caja-chica/saveCajaChica`, otro);
  }

}
