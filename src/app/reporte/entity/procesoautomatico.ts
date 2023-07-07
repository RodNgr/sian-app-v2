export class ProcesoAutomatico {
    
    public cliente_sap!: string;
	public id_empresa!: number;
	public empresa!: string;
	public tienda!: number;
	public nombretienda!: string;
	public id_tipo_proceso!: number;
	public proceso!: string;
	public ip_ftp!: string;
	public nu_puerto_ftp!: number;
	public de_usuario_ftp!: string;
	public de_clave_ftp!: string;
	public de_prefijo!: string;
	public id_store!: string;
	public id_mall!: string;
	public nu_store!: string;
	public ftp_file_destino!: string;
	public codigoinmueblerp!: string;
	public codigoLocalrp!: string;
	public estado!: string;
}
export class TipoProceso {
	public id_tipo_proceso!: number;
	public proceso!: string;
}