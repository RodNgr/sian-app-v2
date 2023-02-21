import { SolicitudDetalle } from "./solicitud-detalle";

export class Solicitud {

    public id!: number;
	public descripcion!: string;
	public estado!: string;
	public diem!: string;
	public prefijo!: string;
	public usuarioCreacion!: string;
	public fechaCreacion!: Date;
	public usuarioModificacion!: string;
	public fechaModificacion!: Date;
	public usuarioDiem!: string;
	public fechaDiem!: Date;
	public usuarioPrefijo!: string;
	public fechaPrefijo!: Date;
	public idEmpresa!: number;
	public idEmpresaSap!: string;

	public detalleList: SolicitudDetalle[] = [];

}