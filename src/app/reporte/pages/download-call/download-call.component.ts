import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CallService } from '../../services/call.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-download-call',
  templateUrl: './download-call.component.html',
  styleUrls: ['./download-call.component.css']
})
export class DownloadCallComponent implements OnInit {

  constructor(public spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  public exportList(): void {
    this.spinner.show();
    try {
      window.location.href = environment.urlReporte + '/api/cliente-call/download'
      this.spinner.hide()
    } catch {
      this.spinner.hide()
    }   
  }

}
