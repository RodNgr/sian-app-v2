import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { ValeService } from '../../services/vale.service';

import { ValeEntel } from '../../dto/vale-entel';

import swal from 'sweetalert2';

@Component({
  selector: 'app-cupon-entel',
  templateUrl: './cupon-entel.component.html',
  styleUrls: ['./cupon-entel.component.css']
})
export class CuponEntelComponent implements OnInit {

  public title!: string;

  public type!: string;

  public vale: ValeEntel = new ValeEntel();

  public isMobile: boolean = window.innerWidth < 641
  
  constructor(private authService: AuthService,
              private spinner: NgxSpinnerService,
              private valeEntelService: ValeService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.title = "Crear Vale Entel";
      this.type = sessionStorage.getItem('tipoOperacion')!;
      this.initValeEntel();
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de vales de cortesía', 'error');
      this.type = 'V';
    }
  }

  initValeEntel() {
    this.vale.fecInicio = new Date();
    this.vale.fecFin= new Date();
    this.vale.excluir="ÑO";
  }

  public generar(): void {
    if (this.type === 'N') {
      const diff = Math.floor(this.vale.fecFin.getTime() - this.vale.fecInicio.getTime());
      const day = 1000 * 60 * 60 * 24;

      const days = Math.floor(diff / day);

      console.log(days);

      if (days > 6 || days < 0) {
        swal.fire('Advertencia!', 'La vigencia no es válida. Los vales Entel no pueden tener una vigencia de más de 7 días', 'warning');
        return;
      }

      this.spinner.show();
      this.vale.usuario = this.authService.usuario.username;

      this.valeEntelService.generaValesEntel(this.vale).subscribe(
        _data => {
          sessionStorage.setItem('message', 'Vale creado exitosamente!');
          this.router.navigateByUrl("/home/cupon/lista-cupon-entel");
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          swal.fire(err.error.mensaje, err.error.error, 'error');
        }
      );
    }
  }

  public cancelar(): void {
    this.router.navigateByUrl('/home/cupon/lista-cupon-entel');
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
