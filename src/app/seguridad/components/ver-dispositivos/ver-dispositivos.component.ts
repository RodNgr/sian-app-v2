import { Component, HostListener, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { DeviceService } from '../../services/device.service';

import { Usuario } from 'src/app/shared/entity/usuario';
import { Device } from '../../entity/device';

import swal from 'sweetalert2';

@Component({
  selector: 'app-ver-dispositivos',
  templateUrl: './ver-dispositivos.component.html',
  styleUrls: ['./ver-dispositivos.component.css']
})
export class VerDispositivosComponent implements OnInit {

  public deviceList: Device[] = [];

  public usuario!: Usuario;

  public isMobile: boolean = window.innerWidth < 641;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private deviceService: DeviceService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.usuario = this.config.data;

    this.spinner.show();

    this.deviceService.getDevices(this.usuario.codigo).subscribe(
      deviceList=> {
        this.deviceList = deviceList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener los dispositivos', icon: 'error', target: 'dt', backdrop: 'false'});
      }
    );
  }

  public cerrar() {
    this.ref.close();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
