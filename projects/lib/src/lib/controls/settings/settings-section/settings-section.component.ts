import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'settings-section',
    templateUrl: './settings-section.component.html',
    styleUrls: ['./settings-section.component.scss'],
    standalone: false
})
export class SettingsSectionComponent implements OnInit {

  @Input() title: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
