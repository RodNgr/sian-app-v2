import { SolicitudDetallePk } from "./solicitud-detalle-pk";

export class SolicitudDetalle {

	public id!: SolicitudDetallePk;
	public copixel!: string;
	public codsap!: string;
	public cantidad!: number;
	public descripcion!: string;
	public monto!: number;
	public usuarioCreacion!: string;
	public fechaModificacion!: string;
     
	public first: boolean = false; 

}