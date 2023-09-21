import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CuentaBancaria } from '../entity/cuenta-bancaria';
import { Observable } from 'rxjs';
import { CuentaBancarias, cbobancos, CuentaBancariasGeneral } from '../entity/CuentaBancaria';
import { Banco } from '../entity/banco';
import { Moneda } from '../entity/moneda';

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

      getBancosCambioCuenta(Marca: number,Moneda: number): Observable<cbobancos[]>{
        return this.http.get<cbobancos[]>(`${this.urlEndPoint}/api/CambioCuenta/Bancos?Marca=${Marca}&Moneda=${Moneda}`);
      }
    
      GuardarCuenta(IdCuenta: number,Marca: number, Tienda: number, Banco: number, Moneda: number, Numero: string, Cuenta: string): Observable<number> {
        return this.http.post<number>(`${this.urlEndPoint}/api/CambioCuenta/GuardarCuenta?IdCuenta=${IdCuenta}&Marca=${Marca}&Tienda=${Tienda}&Banco=${Banco}&Moneda=${Moneda}&Numero=${Numero}&Cuenta=${Cuenta}`, null);
      }


      getListaCuenta(IdCuenta: number): Observable<CuentaBancariasGeneral[]> {
        var ruta = "";
        ruta = `${this.urlEndPoint}/api/CuentaBancaria/Lista?IdCuenta=${IdCuenta}`
        return this.http.get<CuentaBancariasGeneral[]>(ruta);
      }

      getBancos(): Observable<Banco[]> {
        return this.http.get<Banco[]>(`${this.urlEndPoint}/api/CuentaBancaria/banco`);
      }
    
      getMoneda(): Observable<Moneda[]> {
        return this.http.get<Moneda[]>(`${this.urlEndPoint}/api/CuentaBancaria/moneda`);
      }
    
      GuardarCuentaBancaria(cuentaBancariasGeneral: CuentaBancariasGeneral): Observable<number> {
        return this.http.post<number>(`${this.urlEndPoint}/api/CuentaBancaria/GuardarCuenta`, cuentaBancariasGeneral);
      }

      EliminarCuentaBancaria(cuentaBancariasGeneral: CuentaBancariasGeneral): Observable<number> {
        return this.http.post<number>(`${this.urlEndPoint}/api/CuentaBancaria/eliminarcuenta`, cuentaBancariasGeneral);
      }
      
}