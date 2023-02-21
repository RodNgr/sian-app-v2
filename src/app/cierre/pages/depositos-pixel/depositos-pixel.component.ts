import { Component, OnInit } from '@angular/core';
import { Deposito } from '../../entity/deposito';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CierreDiaService } from '../../services/cierre-dia.service';
import { DepositoDto } from '../../dto/deposito-dto';
import { NgxSpinnerService } from 'ngx-spinner';

import swal from 'sweetalert2';
import { EmpresaService } from '../../../shared/services/empresa.service';

@Component({
  selector: 'app-depositos-pixel',
  templateUrl: './depositos-pixel.component.html',
  styleUrls: ['./depositos-pixel.component.css']
})
export class DepositosPixelComponent implements OnInit {

  public depositos: Deposito[] = [];

  constructor(private cierreDiaService: CierreDiaService,
    private spinner: NgxSpinnerService,
    private empresaService: EmpresaService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {    
    this.spinner.show();

    this.cierreDiaService.getDepositos(this.config.data).subscribe(
      resultado => {        
        this.depositos = resultado;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los depósitos', 'error');
      }
    )
  }

  public cancelar(): void {
    this.ref.close();
  }
}
