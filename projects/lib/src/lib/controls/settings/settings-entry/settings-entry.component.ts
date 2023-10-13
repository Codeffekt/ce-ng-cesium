import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'settings-entry',
  templateUrl: './settings-entry.component.html',
  styleUrls: ['./settings-entry.component.scss']
})
export class SettingsEntryComponent implements OnInit {

  @Input() disabled: boolean;

  @HostBinding('class.disabled')
  get isDisabled() { return this.disabled }

  constructor() { }

  ngOnInit(): void {
  }

}
