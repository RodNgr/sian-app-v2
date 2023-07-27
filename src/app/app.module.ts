import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from 'primeng/api';

import { AuthInterceptorService } from './shared/interceptors/auth.interceptor';

import { AppComponent } from './app.component';

import localeEsPE from '@angular/common/locales/es-PE';
import { TokenInterceptorService } from './shared/interceptors/token.interceptor';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';

registerLocaleData(localeEsPE, 'es-PE');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    AppRoutingModule,
    SharedModule,
    HighlightModule,
    ReactiveFormsModule,
    LoggerModule.forRoot({
      serverLoggingUrl: `${environment.urlCarta}/RegistrarLogs`,
      serverLogLevel: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: false,
      level: NgxLoggerLevel.LOG,
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: HIGHLIGHT_OPTIONS, useValue: {fullLibraryLoader: () => import('highlight.js')} },
    { provide: DatePipe}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
