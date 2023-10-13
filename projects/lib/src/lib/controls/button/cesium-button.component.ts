import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'cesium-button',
  templateUrl: `./cesium-button.component.html`,
  styleUrls: ['./cesium-button.component.scss']
})
export class CesiumButtonComponent implements OnInit {

  @Input() icon: string;
  @Input() active: boolean;
  @Output() onClick = new EventEmitter();

  @Input() toolTip: string;
  // @Input() label: string;

  constructor() { }

  ngOnInit() { }

}