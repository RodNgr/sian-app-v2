import { Tienda } from '../entity/tienda';
import { MethodPay } from '../entity/method-pay';
import { Empresa } from 'src/app/shared/entity/empresa';

export class ParamDto {

    public tiendaList: Tienda[] = [];
	public formaPagoList: MethodPay[] = [];

	public feInicio!: string;
	public feFin!: string;
	public intervalo!: number;
	public idEmpresa!: number;
	public tipoVenta!: string;
	public tiendaSap!: string;
	public estado!: number;

}