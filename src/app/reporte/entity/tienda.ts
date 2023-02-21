import { TiendaPk } from './tienda-pk';

export class Tienda {

	public pk: TiendaPk = new TiendaPk();
	public tienda!: number;
	public idEmpresa!: number;
    public codigo!: string;
	public nombre!: string;
	public tiendaPixel!: string;
	public ipTienda!: string;
	public ipRouter!: string;
	public servidor!: string;
	public instancia!: string;
	public baseDatos!: string;
	public usuario!: string;
	public password!: string;
	public clienteSap!: string;
	public ipSybase!: string;
	public puertoSybase!: string;
	public servidorSybase!: string;
	public baseDatosSybase!: string;
	public usuarioSybase!: string;
	public passwordSybase!: string;
	public mensaje!: string;
	public empresa!: string;

}