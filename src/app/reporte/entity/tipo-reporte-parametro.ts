import { TipoReporteParametroPk } from './tipo-reporte-parametro-pk';

export class TipoReporteParametro {

     public pk: TipoReporteParametroPk = new TipoReporteParametroPk();
	public descripcion!: string;
	public tipo!: string;
	public variable!: string;

}