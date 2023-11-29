import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { environment } from 'src/environments/environment';
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
  private _clientsecretdescuento: string;

  private _token!: string;
  private _newToken!: string;

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
    this._clientsecretdescuento = environment.clientsecretdescuento;
  }

  getDataCupones() {
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
      `${this.urlLista}/RollbackCampanha?Codigo=` +
        codigoCabecera +
        `&Motivo=` +
        motivo,
      {}
    );
  }

  isAuthenticated(): boolean {
    return !!this.token;
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

  TokenClientDescuento() {
    return this.http
      .post(`${this.urlEndPointOmnicanal}/generatoken`, {
        grant_type: this._gtype,
        client_id: this._clientid,
        client_secret: this._clientsecretdescuento,
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
    if (!this._token) {
      this.TokenClientDescuento().subscribe({
        next: (data) => {
          this._token = data.access_token;
          return data.access_token;
        },
      });
    } else if (sessionStorage.getItem('token_genesys') !== null) {
      this._token = sessionStorage.getItem('token_genesys')!;
      return this._token;
    }

    return this._token;
  }

  public async generateBenefitToken() {
    return this.TokenClientDescuento().toPromise();
  }

  obtenerTokenBy(keyName: string) {
    if (!this._newToken) {
      this.TokenClientDescuento().subscribe({
        next: (data) => {
          this._newToken = data.access_token;
          return data.access_token;
        },
      });
    } else if (sessionStorage.getItem('token_genesys') !== null) {
      this._newToken = sessionStorage.getItem('token_genesys')!;
      return this._newToken;
    }

    return this._newToken;
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

  listarFeriados() {
    return this.TokenClientDescuento().pipe(
      map((data) => {
        let Bearer: string = `Bearer ${data.access_token}`;
        console.log('listarFeriados usa token: ', Bearer);

        const httpHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
        }).set('Authorization', Bearer);
        return this.http
          .get<any>(`${this.urlEndPointOmnicanal}/listarFeriados`, {
            headers: httpHeaders,
          })
          .pipe(map((data) => data));
      })
    );
  }

  listarBeneficios() {
    return this.TokenClientDescuento().pipe(
      map((data) => {
        let Bearer: string = `Bearer ${data.access_token}`;
        console.log('listarBeneficioEmpleado usa token: ', Bearer);
    
        const httpHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
        }).set('Authorization', Bearer);
        return this.http
          .get<any>(`${this.urlEndPointOmnicanal}/listarBeneficioEmpleado`, {
            headers: httpHeaders,
          })
          .pipe(map((data) => data));
      })
    );
  }

  listarTiendas() {
    return this.TokenClientDescuento().pipe(
      map((data) => {
        let Bearer: string = `Bearer ${data.access_token}`;
        console.log('listarBeneficioEmpleado usa token: ', Bearer);
    
        const httpHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
        }).set('Authorization', Bearer);
        return this.http
          .get<any>(`${this.urlEndPointOmnicanal}/listarTiendasBeneficio`, {
            headers: httpHeaders,
          })
          .pipe(map((data) => data));
      })
    );
  }

  async createBenefit(body) {
    const dataToken = await this.generateBenefitToken();
    let Bearer: string = `Bearer ${dataToken.access_token}`;
    console.log('listarTiendasBeneficio usa token: ', Bearer);

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    }).set('Authorization', Bearer);
    return this.http.post<any>(
      `${this.urlEndPointOmnicanal}/crearBeneficioEmpleado`,
      { ...body },
      { headers: httpHeaders }
    ).toPromise();
  }
}
