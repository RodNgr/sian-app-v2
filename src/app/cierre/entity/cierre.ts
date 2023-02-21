import { Empresa } from './empresa';
import { Tienda } from './tienda';
import { HowPaid } from './howPaid';
import { Deposito } from './deposito';
import { CierreTurno } from './cierreTurno';
import { CierreArqueo } from './cierreArqueo';
import { ResumenVenta } from '../dto/resumenVenta';
import { ResumenArqueo } from '../dto/resumenArqueo';
import { CierreOtro } from './cierre-otro';
export class Cierre{

    public empresa!: Empresa;
	public tienda!: Tienda;
	public howPaid!: HowPaid;
	
	public idCierre: number = -1;
	public fecha:string = '';
	public totalVenta!: number;
	public subTotalArqueo!: number;
	public montoRendidoSoles!: number;
	public montoComision!: number;
	public montoRendidoSolesSinComision!: number;
	public montoRendidoDolares!: number;
	public montoOtroSoles!: number;
	public montoOtroDolares!: number;
	public montoDepositoSoles!: number;
	public montoDepositoDolares!: number;
	public observacion: string = '';
	public usaDeposito!: string;
	public tipoCambio!: number;
	public estado!: string;
	public estadoNombre!: string;
	public usuarioCierre!: number;
	public fechaCierre!: string;
	public fechaCreacion!: string;
	public usuarioCreacion!: number;
	public fechaModificacion!: string;
	public usuarioModificacion!: number;
	public usuarioCierreNombre!: string;
	public usuarioCreacionNombre!: string;
	public usuarioModificacionNombre!: string;
	public sql!: string;
	public valida!: number;
	public grabar!: number;
	public cierreOtroDel!: CierreOtro;
	public usrCreaSW!: string;
	public usrModSW!: string;
	public usrCierreSW!: string;

	
	public cierreTurnoList: CierreTurno[] = [];
	public cierreArqueoList: CierreArqueo[] = [];	
	public depositoList: Deposito[] = [];
	public resumenVentaList: ResumenVenta[] = [];
	public resumenArqueoList: ResumenArqueo[] = [];
	public cierreOtroList: CierreOtro[] = [];

}