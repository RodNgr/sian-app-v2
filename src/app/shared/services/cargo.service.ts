import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DescuentoCargo } from 'src/app/rrhh/entity/descuento-cargo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonDescuentoCargoService {
  private urlEndPoint: string

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlRrhh;
  }

  getDescuentosCargo(): Observable<DescuentoCargo[]> {
      return this.http.get<DescuentoCargo[]>(`${this.urlEndPoint}/api/descuento-cargo/`);
  }

}
