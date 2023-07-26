import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CuentaBancaria } from '../entity/cuenta-bancaria';
import { Observable } from 'rxjs';
import { CuentaBancarias, cbobancos } from '../entity/CuentaBancaria';

@Injectable({
    providedIn: 'root'
  })
export class CambioCuentaService {

    private urlEndPoint: String;

    constructor(private http: HttpClient) { 
        this.urlEndPoint = environment.urlCierre;
    }

    getListaCuentaBancaria(Marca: String, Tienda: String): Observable<CuentaBancarias[]> {
        var ruta = "";
        if(Tienda == undefined){
            ruta = `${this.urlEndPoint}/api/CambioCuenta/ListaCuentaBancaria?Marca=${Marca}&Tienda`
        } else {
            ruta = `${this.urlEndPoint}/api/CambioCuenta/ListaCuentaBancaria?Marca=${Marca}&Tienda=${Tienda}`
        }
        return this.http.get<CuentaBancarias[]>(ruta);
      }

      getCuentaBancariaSeleccionada(Marca: number, Tienda: number, idcuenta: number, Moneda: number): Observable<CuentaBancarias[]>{
        return this.http.get<CuentaBancarias[]>(`${this.urlEndPoint}/api/CambioCuenta/CuentaBancariaSeleccionada?Marca=${Marca}&Tienda=${Tienda}&Banco=${idcuenta}&Moneda=${Moneda}`);
      }

      getBancos(Marca: number,Moneda: number): Observable<cbobancos[]>{
        return this.http.get<cbobancos[]>(`${this.urlEndPoint}/api/CambioCuenta/Bancos?Marca=${Marca}&Moneda=${Moneda}`);
      }
    
      GuardarCuenta(IdCuenta: number,Marca: number, Tienda: number, Banco: number, Moneda: number, Numero: string, Cuenta: string): Observable<number> {
        return this.http.post<number>(`${this.urlEndPoint}/api/CambioCuenta/GuardarCuenta?IdCuenta=${IdCuenta}&Marca=${Marca}&Tienda=${Tienda}&Banco=${Banco}&Moneda=${Moneda}&Numero=${Numero}&Cuenta=${Cuenta}`, null);
      }
}