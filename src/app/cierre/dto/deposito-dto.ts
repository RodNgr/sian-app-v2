import { Tienda } from "../entity/tienda";

export class DepositoDto {

     public idEmpresa!: number;
     public tienda!: Tienda;
     public idBanco!: number;
     public tiendas!: string;
     public fechaInicial!: string;
     public fechaFinal!: string;

}