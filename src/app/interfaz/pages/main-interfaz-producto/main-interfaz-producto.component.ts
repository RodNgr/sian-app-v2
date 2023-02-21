import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-main-interfaz-producto',
  templateUrl: './main-interfaz-producto.component.html',
  styleUrls: ['./main-interfaz-producto.component.css']
})
export class MainInterfazProductoComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
