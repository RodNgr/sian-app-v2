import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';

import swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';
import { ReporteService } from '../../services/reporte.service';
import { Tienda } from '../../entity/tienda';

@Component({
  selector: 'app-tienda-deposito',
  templateUrl: './tienda-deposito.component.html',
  styleUrls: ['./tienda-deposito.component.css'],
})
export class TiendaDepositoComponent implements OnInit {
  private usaDeposito: string;

  public tiendaList: Tienda[] = [];
  public tiendaSeleccionada!: Tienda;
  public tipoDeposito!: string;
  public depositoSeleccionado;

  tipoUsaDeposito = [
    { code: 'S', nombre: 'Deposito Prosegur' },
    { code: 'N', nombre: 'RECAUDACIÓN' },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private empresaService: EmpresaService,
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    this.usaDeposito = '';

    this.spinner.show();
    this.reporteService
      .getTiendasPorEmpresa(
        this.empresaService.getEmpresaSeleccionada().idEmpresa,
        this.authService.getUsuarioInterface()
      )
      .subscribe(
        (tiendaList) => {
          this.tiendaList = tiendaList;

          if (this.tiendaList.length === 1) {
            this.tiendaSeleccionada = this.tiendaList[0];
          }

          this.spinner.hide();
        },
        (_err) => {
          this.spinner.hide();
          swal.fire(
            'Error',
            'Problemas al obtener la información de las tiendas',
            'error'
          );
        }
      );
  }

  public changeTienda(): void {
    if (!this.tiendaSeleccionada) {
      return;
    }

    if (this.tiendaSeleccionada.usaDeposito === 'S') {
      this.usaDeposito = 'S';
      this.tipoDeposito = 'DEPOSITO PROSEGUR';
    } else {
      this.usaDeposito = 'N';
      this.tipoDeposito = 'RECAUDACIÓN';
    }
  }

  onEditar() {
    if (!this.depositoSeleccionado.code) {
        swal.fire('Error', 'Debe seleccionar las opciones', 'warning');
        return;
    }
    const payload = { tienda: this.tiendaSeleccionada.tienda, usaDeposito: this.depositoSeleccionado?.code };
    this.reporteService.updateTiendaDeposito(
      this.empresaService.getEmpresaSeleccionada().idEmpresa,
      payload
    ).subscribe({
        next: () => {
            swal.fire('Editar', 'Empresa editada satisfactoriamente', 'success');
        },
        error: () => {
            swal.fire('Error', 'Empresa no actualizada', 'error');
        }
    });
  }

  onChangeTipoDeposito() {
    console.log(this.depositoSeleccionado);
  }
}
