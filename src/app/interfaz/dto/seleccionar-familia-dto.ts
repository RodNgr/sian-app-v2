import { Familia } from '../entity/familia';
import { SubFamilia1 } from '../entity/sub-familia1';
import { SubFamilia2 } from '../entity/sub-familia2';
import { SubFamilia3 } from '../entity/sub-familia3';
import { SubFamilia4 } from '../entity/sub-familia4';
import { TipoConsumo } from '../entity/tipo-consumo';

export class SeleccionarFamiliaDto {

     public descripcion!: string;
     public tipoConsumo!: TipoConsumo;
     public familia!: Familia;
     public subFamilia1!: SubFamilia1;
     public subFamilia2!: SubFamilia2;
     public subFamilia3!: SubFamilia3;
     public subFamilia4!: SubFamilia4;
     public clasica!: number;
     public premium!: number;

}