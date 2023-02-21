import { Component, OnInit } from '@angular/core';
import { ClientCall } from '../../entity/client-call';
import { NgxSpinnerService } from 'ngx-spinner';
import { CallService } from '../../services/call.service';
import swal from 'sweetalert2';

interface TipoBusqueda {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-consulta-call',
  templateUrl: './consulta-call.component.html',
  styleUrls: ['./consulta-call.component.css']
})
export class ConsultaCallComponent implements OnInit {

  public tipoList: TipoBusqueda[] = [
    {codigo: 'D', descripcion: 'Documento'}, 
    {codigo: 'T', descripcion: 'Teléfono'}, 
  ];

  public tipoSelected: TipoBusqueda = {codigo: 'T', descripcion: 'Teléfono'};

  public documento!: string;

  public clienteList: ClientCall[] = [];

  constructor(public spinner: NgxSpinnerService,
              public callService: CallService) { }

  ngOnInit(): void {
  }

  public buscar(): void {
    if (this.tipoSelected.codigo === 'D') {
      this.spinner.show();
      this.callService.getClientePorDocumento(this.documento).subscribe(
        clienteList => {
          this.clienteList = clienteList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al consultar la información de clientes', 'error');
        }
      );
    } else if (this.tipoSelected.codigo === 'T') {
      this.spinner.show();
      this.callService.getClientePorTelefono(this.documento).subscribe(
        clienteList => {
          this.clienteList = clienteList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al consultar la información de clientes', 'error');
        }
      );
    }
  }

}
