import { Aplicacion } from './aplicacion';
import { Tipo } from './tipo';

export class LoginFallido {

    public id!: number;
    public userId!: string;
    public ip!: string;
    public date!: Date;
    public type!: string;
    public typeDesc!: string;
    public applicationId!: number;

    public tipo!: Tipo;
    public aplicacion!: Aplicacion;

}
