import { Tienda } from '../entity/tienda';

export class FiltroDto {

     public tiendas!: Tienda[];
	public idEmpresa!: number; //Cierre dia
	public fechaInicio!: string; //Cierre dia
	public fechaFin!: string;
	public interfaceList!: string[];
	public usuario!: string;
	public cierreList!: number[];

	//Datos para el proceso de interfaces
	public idTienda!: string; //Cierre dia
	public fecha!: string;
	public idUsuario!: number; //Cierre dia
	public ip!: string;
	public tipo!: string;
	public mensaje!: string;
	public lisTiendas: String[] =[];
	public forzarEjecucion!: string;
	public fecDate!: Date;
}