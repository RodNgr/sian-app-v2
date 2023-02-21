import { Component, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { LoginFallidoService } from '../../services/login-fallido.service';

import swal from 'sweetalert2';

interface Ip {
  id: string,
  contador: number
};

@Component({
  selector: 'app-ips-bloqueadas',
  templateUrl: './ips-bloqueadas.component.html',
  styleUrls: ['./ips-bloqueadas.component.css']
})
export class IpsBloqueadasComponent implements OnInit {

  public ips: Ip[] = []

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private loginFallidoService: LoginFallidoService) { }

  ngOnInit(): void {
    this.listar();
  }

  private listar(): void {
    this.spinner.show();
    this.loginFallidoService.getIpsBloqueadas().subscribe(
      response => {
        const map = new Map<string, number>(Object.entries(response));
        map.forEach((value, key) => {
          this.ips.push({id: key, contador: value})
        })
        
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las ips', 'error');
      }
    );
  }

  public delete(ip: Ip): void {
    this.loginFallidoService.removeIpsBloqueadas(ip.id).subscribe(
      _response => {
        window.location.reload();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al liberar la ip', 'error');
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
