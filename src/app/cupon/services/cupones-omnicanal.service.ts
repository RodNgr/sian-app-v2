import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { environment } from 'src/environments/environment';
import { CuponOmnicanalDetalle } from '../entity/cuponOmnicanalDetalle';


@Injectable({
  providedIn: 'root'
})
export class CuponesOmnicanalService {

  url:string ="assets/datacuponesgenerados.json";

  private urlEndPoint: string;
  private urlEndPointOmnicanal: string;
  private urlLista: String;

  private _token!: string;

  constructor(private http: HttpClient,
    private empresaService: EmpresaService) { 
      this.urlEndPoint = environment.urlTstdrpApi;
      this.urlEndPointOmnicanal = environment.urlOmnicanalA;
      this.urlLista = environment.urlCarta;
  }

  getDataCupones() {
    //console.log(this.empresaService.getEmpresaSeleccionada());
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().codSap;
    console.log(idEmpresa);
    console.log(`${this.urlEndPoint}/listarcupon`);

    return this.http.get(this.url)

  }

  listarCupones() {

    let Bearer: string = `Bearer ${this.token}`;
    console.log("listarCupones usa token: ", Bearer);

    let httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
    .set('Authorization', Bearer);

    return this.http.post<any>(`${this.urlEndPointOmnicanal}/listarcupon`, { 'codmarca' : '1002'} , {headers: httpHeaders}).pipe(
      map( (resp: any) => { return resp; }),
      catchError(e => { return throwError(e);})
    );
  }

  getCupones(id: number): Observable<CuponOmnicanalDetalle[]> {
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.get<CuponOmnicanalDetalle[]>(`${this.urlLista}/getDataCupones?Codigo=${id}`);
  }

  isAuthenticated(): boolean {
    console.log("this.token", this.token);
    let payload = this.obtenerDatosToken(this.token);
    console.log(payload)
    if (payload !== null && payload.length > 0) {
        return true;
    }

    return false;
  }

  private obtenerDatosToken(accesToken: string): any {
    if (accesToken && accesToken.length > 0) {
        return accesToken;
    }

    return null;
  }

  TokenClient() {
    return this.http.post(`${this.urlEndPointOmnicanal}/generatoken`, {"grant_type": "client_credentials","client_id": "7tj4d2jf2kenqkra76ga751omni","client_secret": "mgps0alo77vpdviokkumq2njk3vggki7rnam9ho02sluvliiomni"}).pipe(
      map( (resp: any) => {
        console.log("Se crea el token");
        this.handledToken(resp.access_token);
        return resp;
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  private handledToken(access_token: string) {
    this.guardarToken(access_token);
  }

  private guardarToken(accesToken: string): void {
    this._token = accesToken;
    sessionStorage.setItem('token_genesys', accesToken);
  }

  removerToken() {
    let temp_token!: string;
    this._token = temp_token;
    sessionStorage.removeItem('token_genesys');
  }
  
  public get token(): string {
    if (this._token !== undefined) {
        return this._token;
    } else if (sessionStorage.getItem('token_genesys') !== null) {
        this._token = sessionStorage.getItem('token_genesys')!;
        return this._token;
    }

    return '';
  }
  
  
}
