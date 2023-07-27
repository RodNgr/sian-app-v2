import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { environment } from 'src/environments/environment';
import { CuponOmnicanalDetalle } from '../entity/cuponOmnicanalDetalle';
import * as $ from 'jquery';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CuponesOmnicanalService {
  url: string = 'assets/datacuponesgenerados.json';

  private urlEndPoint: string;
  private urlEndPointOmnicanal: string;
  private urlLista: String;

  private _gtype: string;
  private _clientid: string;
  private _clientsecret: string;

  private _token!: string;

  constructor(
    private http: HttpClient,
    private empresaService: EmpresaService,
    private authService: AuthService,
    private logger: NGXLogger
  ) {
    this.urlEndPoint = environment.urlTstdrpApi;
    this.urlEndPointOmnicanal = environment.urlOmnicanalA;
    this.urlLista = environment.urlCarta;

    this._gtype = environment.gtype;
    this._clientid = environment.clientid;
    this._clientsecret = environment.clientsecret;
  }

  getDataCupones() {
    //console.log(this.empresaService.getEmpresaSeleccionada());
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().codSap;
    console.log(idEmpresa);
    console.log(`${this.urlEndPoint}/listarcupon`);

    return this.http.get(this.url);
  }

  listarCupones() {
    let Bearer: string = `Bearer ${this.token}`;
    console.log('listarCupones usa token: ', Bearer);

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    }).set('Authorization', Bearer);

    return this.http
      .post<any>(
        `${this.urlEndPointOmnicanal}/listarcupon`,
        { codmarca: '1002' },
        { headers: httpHeaders }
      )
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  rollbackCampanha(codigoCabecera: number, motivo: string) {
    return this.http.post<any>(
      `${this.urlLista}/AnularCampanha?Codigo=` +
        codigoCabecera +
        `&Motivo=` +
        motivo,
      {}
    );
  }

  getCupones(id: number): Observable<CuponOmnicanalDetalle[]> {
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.get<CuponOmnicanalDetalle[]>(
      `${this.urlLista}/getDataCupones?Codigo=${id}`
    );
  }

  isAuthenticated(): boolean {
    console.log('this.token', this.token);
    let payload = this.obtenerDatosToken(this.token);
    console.log(payload);
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

  TokenOmnicanal() {
    return this.http
      .post(`${this.urlEndPointOmnicanal}/generatoken`, {
        grant_type: this._gtype,
        client_id: this._clientid,
        client_secret: this._clientsecret,
      })
      .pipe(
        map((resp: any) => {
          sessionStorage.setItem('token_omnicanal', resp.access_token);
          return resp;
        }),
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  TokenClient() {
    return this.http
      .post(`${this.urlEndPointOmnicanal}/generatoken`, {
        grant_type: this._gtype,
        client_id: this._clientid,
        client_secret: this._clientsecret,
      })
      .pipe(
        map((resp: any) => {
          console.log('Se crea el token');
          this.guardarToken(resp.access_token);
          return resp;
        }),
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  private guardarToken(access_token: string) {
    this._token = access_token;
    sessionStorage.setItem('token_genesys', access_token);
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

  registrarLog(module: string, action: string, message: string) {
    this.logger.setCustomParams(
      new HttpParams({
        fromObject: {
          userId: this.authService.usuario.username,
          module,
          action,
        },
      })
    );

    this.logger.debug(message);
  }
}
