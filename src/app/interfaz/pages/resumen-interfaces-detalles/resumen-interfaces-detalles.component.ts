import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import swal from 'sweetalert2';

@Component({
    selector: 'app-resumen-interfaces-detalles',
    templateUrl: './resumen-interfaces-detalles.component.html',
    styleUrls: ['./resumen-interfaces-detalles.component.css']
  })
export class ResumenInterfacesDetallesComponent implements OnInit {

    public interfaces: any[] = [];

    constructor(public config: DynamicDialogConfig,
        public ref: DynamicDialogRef){
    }


    ngOnInit(): void {   
        this.config.data.sort(function(a,b){
            if (a.idEjecucion > b.idEjecucion){ return 1; }
            if (a.idEjecucion < b.idEjecucion){ return -1; }
            return 0;
        })
        
        this.interfaces = this.config.data;

        this.interfaces.forEach( int => {

            if(int.estado.length == 1){ 
                switch(int.estado){
                    case "C": int.estado = "Correcto";  break;
                    case "E": int.estado = "Error";  break;
                    default: int.estado = " - ";  break;
                }
            }

            int.feInicioProceso = this.interfaceToDate(int.feInicioProceso);
            int.feFinProceso = this.interfaceToDate(int.feFinProceso);
        })

        //console.log("interfaces", this.interfaces);
    }

    private interfaceToDate(date: string): string {

        if(!date) { return "**/**/** **:**:**"; } 
        //console.log(date.indexOf("/"))
        if(date.indexOf("/") > 0){ return date; }

        let today  = new Date(date);

        let day = today.getDate()
        let month = today.getMonth() + 1
        let year = today.getFullYear()

        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();

        return this.checkTime(day) + "/" + this.checkTime(month) + "/" + year + " " + this.checkTime(h) + ":" + this.checkTime(m) + ":" + this.checkTime(s);
    }

    private checkTime(i: any) : string {

        if (i < 10) {
            return "0" + i;
        }
        return i;
    }

    public cancelar(): void {
        this.ref.close();
    }

    public observacion(obs: string): void{
        //console.log(obs);
        //swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
        swal.fire({
            title: 'Observación',
            html: '<textarea id="text" style="width: 95%; height: 400px;">' +obs+'</textarea>',
            width: '80%',
            confirmButtonText: 'Cerrar'
        })
    }
}