import { SubFamilia1 } from './sub-familia1';

export class SubFamilia2 {

     public id!: number;
	public idEmpresa!: number;
     public subFamilia1!: SubFamilia1;
	public descripcion!: string;
	public estado!: string;
	public usuarioCreacion!: string;
	public fechaCreacion!: Date;
	public usuarioModificacion!: string;
	public fechaModificacion!: Date;

	public descripcionFamilia: string = (this.subFamilia1 != null ? this.subFamilia1.descripcion : '') + ' - ' + this.descripcion;

}
