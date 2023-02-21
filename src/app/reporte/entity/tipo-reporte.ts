import { TipoReportePk } from './tipo-reporte-pk';

export class TipoReporte {
     
     public pk: TipoReportePk = new TipoReportePk();
     public descripcion!: string;
     public query!: string;
     public permiso!: string;
     public estado!: string;

}