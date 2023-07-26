import { Component, OnInit } from '@angular/core';
import { CuentaBancaria } from '../../entity/cuenta-bancaria';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { forkJoin, Observable } from 'rxjs';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { CambioCuentaService } from '../../services/cambio-cuenta.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditarCuentaBancariaComponent } from '../../components/editar-cuenta-bancaria/editar-cuenta-bancaria.component';
import { CuentaBancarias } from '../../entity/CuentaBancaria';

@Component({
  selector: 'app-cambio-cuenta',
  templateUrl: './cambio-cuenta.component.html',
  styleUrls: ['./cambio-cuenta.component.css']
})
export class CambioCuentaComponent implements OnInit {

  public SeleccionarCuenta: string = '0';
  public CuentasTiendas: CuentaBancarias[] = [];
  public CuentasTiendasTodo: CuentaBancarias[] = [];
  public CuentaSelected!: CuentaBancarias;
  public Tienda!: String;
  public TiendaValida: String = "";
  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private cambioCuentaService: CambioCuentaService,
              private dialogService: DialogService  ) { }

  ngOnInit(): void {
    this.spinner.show();

    if(this.Tienda == undefined){
      this.TiendaValida = '';
    } else {
      this.TiendaValida = this.Tienda;
    }

    this.ListarCuentas(this.empresaService.getEmpresaSeleccionada().idEmpresa,this.Tienda);
    this.spinner.hide();
  }

  onRowSelect(event) {
    
  }

  
  public Buscar(){
    this.spinner.show();
    if(this.Tienda == undefined){
      this.TiendaValida = '';
    } else {
      this.TiendaValida = this.Tienda;
    }

    this.ListarCuentas(this.empresaService.getEmpresaSeleccionada().idEmpresa,this.Tienda);
    this.spinner.hide();
  }

  public ListarCuentas(Empresa,Tienda){
    
    this.cambioCuentaService.getListaCuentaBancaria(Empresa,Tienda).subscribe(
      CuentasTiendas2 => {
        this.CuentasTiendasTodo = CuentasTiendas2;
        this.CuentasTiendas = this.CuentasTiendasTodo;
      }
    )
  }

  public editarCuentaBancaria(): void {    
    this.ref = this.dialogService.open(EditarCuentaBancariaComponent, {
      header: `${this.CuentaSelected.marcaDesc} - ${this.CuentaSelected.tienda}  ${this.CuentaSelected.moneda}`,
      width: '50%',
      contentStyle: { "max-height": "360px", "overflow": "auto" },
      data: this.CuentaSelected
    });

    this.ref.onClose.subscribe((Val: number) => {
      this.ListarCuentas(this.empresaService.getEmpresaSeleccionada().idEmpresa,this.Tienda);
});
  }

  onKDownTienda(event: any) {
    const filtro = this.Tienda.toLowerCase();
    this.CuentasTiendas = this.CuentasTiendasTodo.filter(item => {
      const camposConcatenados = item.tienda.toLowerCase() +"-"+ item.tienda.toLowerCase();
      const camposConcatenados2 = item.cuenta.toLowerCase() +"-"+item.cuenta.toLowerCase();
      const camposConcatenados3 = item.numero.toLowerCase() +"-"+item.numero.toLowerCase();
      return camposConcatenados.includes(filtro)|| camposConcatenados2.includes(filtro) || camposConcatenados2.includes(filtro);
    });


  }
}
