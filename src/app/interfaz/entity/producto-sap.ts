import { Familia } from './familia';
import { SubFamilia1 } from './sub-familia1';
import { SubFamilia2 } from './sub-familia2';
import { SubFamilia3 } from './sub-familia3';
import { SubFamilia4 } from './sub-familia4';
import { TipoConsumo } from './tipo-consumo';

export class ProductoSap {

     public coPixel!: string;
     public coSap!: string;
	public statusR!: string;
	public fchCreacion!: Date;
	public coUsuCreacion!: string;
	public message!: string;
	public dePixel!: string;
	public idEmpresaSap!: number;
	public coCategoriaSap!: string;
	public familia!: Familia;
	public subFamilia1!: SubFamilia1;
	public subFamilia2!: SubFamilia2;
	public subFamilia3!: SubFamilia3;
	public subFamilia4!: SubFamilia4;
	public tipoConsumo!: TipoConsumo;
     public jerarquia!: string;
	public coUsuModificacion!: string;
	public descripcionArticulo!: string;
	public clasica!: number;
	public premium!: number;

}
