import { Usuario } from '../../shared/entity/usuario';

export class Login {

    public username: string = '';
    public password: string = '';
    public roles: string[] = [];
    public user: Usuario = new Usuario();

}
