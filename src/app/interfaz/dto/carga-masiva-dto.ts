import { ProductoSap } from '../entity/producto-sap';
import { RowInvalid } from './row-invalid';

export class CargaMasivaDto {

     public articuloList: ProductoSap[] = [];
     public rowInvalidList: RowInvalid[] = [];

}
