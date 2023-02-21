import { AplicacionRol } from '../entity/aplicacion-rol';

export class UsuarioAplicacionRolDto {

    public codigo!: string;
    public aplicacionId!: number;
    public aplicacionRolList: AplicacionRol[] = [];
    public usuarioModificacion!: string;

}
