import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';

import { FormatoVale } from '../entity/formato-vale';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormatoValeService {

  private urlEndPoint: string

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
      this.urlEndPoint = environment.urlCupones;
  }

  getFormatosVales(): Observable<FormatoVale[]> {
      const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      return this.http.get<FormatoVale[]>(`${this.urlEndPoint}/api/formato-vale/corporativo/${idEmpresa}`);
  }

  getFormatosValesCortesia(): Observable<FormatoVale[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<FormatoVale[]>(`${this.urlEndPoint}/api/formato-vale/cortesia/${idEmpresa}`);
  }

  getFormatovale(id: number): Observable<FormatoVale> {
    return this.http.get<FormatoVale>(`${this.urlEndPoint}/api/formato-vale/${id}`);
  }

  createFormatoVale(formatoVale: FormatoVale): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/formato-vale`, formatoVale);
  }

  editFormatoVale(formatoVale: FormatoVale): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/formato-vale/${formatoVale.id}`, formatoVale);
  }

  subirFormatoVale(archivo: File): Observable<any> {
    let formData = new FormData();
    formData.append("archivo", archivo);

    console.log(formData);

    return this.http.post<any>(`${this.urlEndPoint}/api/formato-vale/upload`, formData);
  }
  
}
