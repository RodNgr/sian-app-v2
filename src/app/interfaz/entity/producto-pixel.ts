import { CategoriaSap } from './categoria-sap';
import { Familia } from './familia';
import { SubFamilia1 } from './sub-familia1';
import { SubFamilia2 } from './sub-familia2';
import { SubFamilia3 } from './sub-familia3';
import { SubFamilia4 } from './sub-familia4';
import { TipoConsumo } from './tipo-consumo';

export class ProductoPixel {

     public prodNum!: number;
	public descript!: string;
	public priceA!: number;
	public rangeStart!: string;
	public reportNo!: number;
	public hoRepGroup!: string;
	public descripcionCategoria!: string;
	public categoria!: string;
	public categoriaSap: CategoriaSap = new CategoriaSap();
	public familia: Familia = new Familia();
	public subFamilia1: SubFamilia1 = new SubFamilia1();
	public subFamilia2: SubFamilia2 = new SubFamilia2();
	public subFamilia3: SubFamilia3 = new SubFamilia3();
	public subFamilia4: SubFamilia4 = new SubFamilia4();
	public tipoConsumo: TipoConsumo = new TipoConsumo();

	public jerarquia!: string;
	public clasica!: number;
	public premium!: number;
}
