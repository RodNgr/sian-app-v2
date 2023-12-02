import { Component, OnInit } from '@angular/core';
import { hub } from '../../entity/hub';
import { ReporteService } from '../../services/reporte.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anular-pedidos-hub',
  templateUrl: './anular-pedidos-hub.component.html',
  styleUrls: ['./anular-pedidos-hub.component.css']
})
export class AnularPedidosHubComponent implements OnInit {

  public title: string = 'ANULAR PEDIDOS HUB'; 

  public SeleccionHUB: number;
  public numeroPedido: String;
  public ListadoHUB: hub[] = [
    { idHub: 0 , descripcionHub: 'Seleccionar HUB'},
  ];
  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.ListadoHub();
    this.SeleccionHUB = 1;
  } 

  ListadoHub(){
    this.reporteService.getListaHub().subscribe(
      tiendaList => {
        console.log(tiendaList);
        this.ListadoHUB = tiendaList;

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        Swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    );
  }

  AnularPedido(){
    this.reporteService.anularPedidoHub(this.SeleccionHUB, this.numeroPedido).subscribe(      
      tiendaList => {        
        Swal.fire({
          title: "Bien!",
          text: "Se eliminaron los pedidos multiplicados",
          icon: "success"
        });
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        Swal.fire('Error', 'No se pudieron eliminar los pedidos multiplicados', 'error');
      }
    );
  }
}
  