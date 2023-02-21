import { Aplicacion } from "./aplicacion";
import { Rol } from "./rol";

export class AplicacionRol {

    public id!: number;
    public application!: Aplicacion;
    public rol!: Rol;
    public usuario!: string;
    public fecha!: Date;

}
