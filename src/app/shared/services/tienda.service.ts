import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tienda } from 'src/app/cierre/entity/tienda';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonReporteService {
  private urlEndPoint: string;

  constructor(private http: HttpClient) {
    this.urlEndPoint = environment.urlCierre;
  }

  getTiendasPorEmpresa(
    idEmpresa: number,
    usuario: string
  ): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(
      `${this.urlEndPoint}/api/reporte/tienda/${idEmpresa}/${usuario}`
    );
  }
}
