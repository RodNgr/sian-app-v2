import { Tienda } from '../entity/tienda';
export class CierreDto {

    public idEmpresa!: number;
	public idTienda!: number;
	public idTiendaArray!: string;
	public fechaInicio!: string;
	public fechaFin!: string;
	public idUsuario!: number;
	public idBanco: number = -1;
	public idMoneda: number = -1;
	public montoRendidoSoles: number = 0;
	public montoRendidoDolares: number = 0;
	public montoDepositoSoles: number = 0;
	public montoDepositoDolares: number = 0;
	public montoOtroSoles: number = 0;
	public montoOtroDolares: number = 0;
	public idCierre!: number;
	public dataModificada: boolean = false;

	public tienda!: Tienda;

	public tiendas: Tienda[] = [];
}