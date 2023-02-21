type Meses = {
	[key: number]: any; 
	name: number;
};
  

export class CallMambresiaBaseDto {

    public cliente!: string;
	public direccion!: string;
	public ciudad!: string;
	public transaccion!: number;
	public tienda!: string;
	public tiendaSap!: string;
	public fechaRegistro!: string;
	public fechaVenta!: string;
	public telefono!: string;
	public tipoTelefono!: string;
	public nivel!: string;
	
	public descripcion!: string;
    public mesesMap: Meses[] = [];

}