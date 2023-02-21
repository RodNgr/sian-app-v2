import { ReporteTienda } from './reporte-tienda';
export class Reporte {

    public idReporte!: number;
	public idUsuario!: string;
	public feCreacion!: Date;
	public feInicio!: Date;
	public feFin!: Date;
	public estado!: string;
	public query!: string;
	public tiReporte!: string;
	public inBaseDatos!: string;
	public usuario!: string;
	public clave!: string;
	public idEmpresa!: number;
	public deEmpresa!: string;

	public reporteTiendaList: ReporteTienda[] = [];
	
}