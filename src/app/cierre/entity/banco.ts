export class Banco {

    public idEmpresa!: number;
	public idTienda!: number;
    public idBanco!: number;
	public nombre!: string;
	public nombreCorto!: string;

	constructor(idBanco: number, nombre: string) {
		this.idBanco = idBanco;
		this.nombre = nombre;
	}

}