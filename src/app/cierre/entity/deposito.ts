import { Empresa } from './empresa';
import { Tienda } from './tienda';
import { Banco } from './banco';
import { Moneda } from './moneda';
import { CuentaBancaria } from './cuenta-bancaria';
import { Cierre } from './cierre';

export class Deposito {
     
     public punchIndex!: number; //turno
     public posName!: string; //cajero
     public noTransaccion!: string; //Nro pagado
     public observacion!: string; //descripcion
     public monto!: number; // monto soles
     public monto2!: number; //monto dolares
     public dateEntered!: string; //fecha
     public idDeposito!: number;
	public idCierre!: number;
	public empresa!: Empresa;
	public tienda!: Tienda;
	public banco!: Banco;
	public moneda!: Moneda;
	public cuentaBancaria!: CuentaBancaria;	
     public fecha!: string;     
     public oficina!: string;     
     public openDate!: string;   
     public cierreFecha!: string;
     public montoOriginal!: number;
     public cierreFechaCierre!: string;
     public fechaInicio!: string;
     public fechaFin!: string;
     public fechaEnTabla!: Date;

     public cierre!: Cierre;
}