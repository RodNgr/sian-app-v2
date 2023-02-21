export class Empresa {

     public codigo!: string;
     public nombre!: string;
     public ruc!: string;
     public codSap!: string;
     public idEmpresa!: number;
     public abreviatura!: string;

     constructor(codigo: string, nombre: string, ruc: string, codSap: string, idEmpresa: number, abreviatura: string) {
          this.codigo = codigo;
          this.nombre = nombre;
          this.ruc = ruc;
          this.codSap = codSap;
          this.idEmpresa = idEmpresa;
          this.abreviatura = abreviatura;
     }

}
