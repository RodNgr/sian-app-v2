import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from './version-check.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private versionCheckService: VersionCheckService) {}

  ngOnInit(): void {
    this.versionCheckService.loadCurrentVersion();
  }

}
