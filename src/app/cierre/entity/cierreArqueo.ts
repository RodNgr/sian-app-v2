import { Moneda } from './moneda';
export class CierreArqueo{

    public moneda!: Moneda;
	
	public idEmpresa!: number;
	public idTienda!: number;
	public idCierre!: number;
	public openDate!: string;
	public idForma!: number;
	public formaPago!: string;
	public cierreCajaVersion!: number;
	public ventaSoles!: number;
	public rendidoSoles!: number;
	public comision!: number;
	public rendidoSolesSinComision!: number;
	public rendidoDolares!: number;
	public tipoCambio!: number;
	public diferencia!: number;

}