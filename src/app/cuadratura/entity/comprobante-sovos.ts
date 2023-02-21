import { ComprobanteSovosPk } from './comprobante-sovos-pk';

export class ComprobanteSovos {

     public id!: ComprobanteSovosPk;
     public cliente!: string;
	public sovos!: string;
	public tienda!: number;
	public terminal!: number;
	public afecto!: number;
	public exento!: number;
	public igv!: number;
	public total!: number;
	public estado!: string;
	public sunat!: string;
	public mensaje!: string;
	public nombreComercial!: string;

}
