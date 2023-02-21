import { Empresa } from './empresa';
import { Tienda } from './tienda';
import { CierreOtroMotivo } from './cierre-otro-motivo';
import { Moneda } from './moneda';
export class CierreOtro {

     public empresa: Empresa = new Empresa();
	public tienda: Tienda = new Tienda(0, '');
     public motivo: CierreOtroMotivo = new CierreOtroMotivo();
     public moneda: Moneda = new Moneda();
     public idCierre!: number;
	public idCierreOtro: number = 0;
    public idCajaChica!: number;
	public monto!: number;
    public codigoEmpleado!: string;
	public nombreEmpleado!: string;
	public numeroDocumentoEmpleado!: string;
    public fechaParam!: string;
	public fechaVenta!: Date;
	public codigoAutorizacion!: string;
	public idUsuario!: number;
	public empleadoCajaChica!: string;
    public fechaInicio!: string;
	public fechaFin!: string;
    public estadoEnvio!: number;
	public estado!: number;
    public descEstado!: string;
    public fechaRegistro!: Date;
    public montoOriginal!: number;
	public cierreFecha!: Date;
	public cierreFechaCierre!: string;
    public horaRegistroS!: string;
	public fechaRegistroS!: string;

}