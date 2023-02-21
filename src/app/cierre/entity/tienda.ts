export class Tienda {
     
    public idEmpresa!: number;
	public idEmpresaSAP!: string;
	
	public tienda!: number;
	public tiendaCodigo!: string;
	public tiendaPixel!: string;
	public tiendaSAP!: string;
	public centroCostoSAP!: string;
	public centroBeneficio!: string;
		
	public nombreTienda!: string;
	public nombreTiendaSAP!: string;
	public nombreTiendaCuadratura!: string;
	public ciudad!: string;
	
	public ipRouter!: string;
	public DnsPixel!: string;
	
	public ipTienda!: string;
	public servidor!: string;
	public instancia!: string;
	public baseDatos!: string;
	public usuario!: string;
	public password!: string;
	
	public ipTiendaSybase!: string;
	public servidorSybase!: string;
	public baseDatosSybase!: string;
	public usuarioSybase!: string;
	public passwordSybase!: string;
	public puertoSybase!: string;
	
	public ipCentral!: string;
	public baseDatosCentral!: string;
	
	public interfaz!: number;
	public esInterfaceVenta!: number;
	public esInterfaceInventario!: number;
	public mixVenta!: number;
	
	public cpe!: number;
	public menajes!: number;
	public menajesD!: number;
	public cierreCajaVersion!: number;
	public usaDeposito!: string;

	constructor(tienda: number, nombreTienda: string) {
		this.tienda = tienda;
		this.nombreTienda = nombreTienda
	}

}