import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DescuentoCargo } from '../entity/descuento-cargo';

@Injectable({
  providedIn: 'root'
})
export class DescuentoCargoService {
  private urlEndPoint: string

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlRrhh;
  }

  getDescuentosCargo(): Observable<DescuentoCargo[]> {
      return this.http.get<DescuentoCargo[]>(`${this.urlEndPoint}/api/descuento-cargo/`);
  }

  createDescuentoCargo(descuentoCargo: DescuentoCargo): Observable<any> {
      return this.http.post<any>(`${this.urlEndPoint}/api/descuento-cargo`, descuentoCargo);
  }

  editDescuentoCargo(descuentoCargo: DescuentoCargo): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/api/descuento-cargo/`, descuentoCargo);
  }

  removeDescuentoCargo(descuentoCargo: DescuentoCargo): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/api/descuento-cargo/remove/`, descuentoCargo);
  }

}
