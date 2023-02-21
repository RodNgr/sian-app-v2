import { AplicacionRol } from "src/app/seguridad/entity/aplicacion-rol";
import { Grupo } from "src/app/seguridad/entity/grupo";

export class Usuario {

	public codigo!: string;
	public codcia!: string;
	public codsuc!: string;
	public razsoc!: string;
	public apepat!: string;
	public apemat!: string;
	public nombre!: string;
	public tipdoc!: string;
	public desdoc!: string;
	public nrodoc!: string;
	public fecini!: Date;
	public fecret!: Date
	public codcar!: string;
	public descar!: string;
	public cencos!: string;
	public descen!: string;
	public celper!: string;
	public celngr!: string;
	public maiper!: string;
	public maingr!: string;
	public estado!: string;
	public tiptra!: string;
	public destip!: string;
	public codcat!: string;
	public descat!: string;
	public codpue!: string;
	public despue!: string;
	public fecnac!: string;
	public fecing!: string;
	public codnac!: string;
	public desnac!: string;
	public codloc!: string;
	public desloc!: string;
	public clave!: string;
	public destipcco!: string;
	public desjef!: string;
	public desbenef!: string;
	public fecUltimoLogueo!: Date;
	public fecUltCambioClave!: Date;
	public estienda!: string;
	public usuariointerface!: string;
     
	public fullName!: string;
	public shortName!: string;
	public claveExpirada: boolean = false;

    public applicationRolList: AplicacionRol[] = [];
	public groupList: Grupo[] = [];

}
