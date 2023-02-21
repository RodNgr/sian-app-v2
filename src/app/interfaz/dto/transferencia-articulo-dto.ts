import { ProductoPixel } from "../entity/producto-pixel";

export class TransferenciaArticuloDto {

     public idEmpresa!: number;
	public idEmpresaSap!: number;
	public marcaAbreviatura!: string;
	public usuario!: string;
	public articulosPixel: ProductoPixel[] = [];

}
