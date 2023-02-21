import { Grupo } from '../entity/grupo';

export class UsuarioGrupoDto {

     public codigo!: string;
     public usuarioModificacion!: string;
     public groupList: Grupo[] = [];

}
