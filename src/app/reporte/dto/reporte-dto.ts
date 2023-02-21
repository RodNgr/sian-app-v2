import { ParamDto } from './param-dto';
import { Tienda } from '../../interfaz/entity/tienda';

export class ReporteDto {

     public idGrupoReporte!: number;
	
	public idTipoReporte!: number;
	
	public idUsuario!: string;
	
	public tiendas: Tienda[] = [];
	
	public parametros!: ParamDto[];

}