import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'viewer-button',
  template: `
  <button class="viewer-control-buttons-item"
          mat-button 
          (click)="click()"
          [class.active]="toggled"
  >
    <mat-icon *ngIf="icon">{{icon}}</mat-icon>
    <span *ngIf="label">{{label}}</span>
  </button>`,
  styleUrls: ['./widget-control-buttons.component.scss']
})
export class WidgetControlButtonsItemComponent implements OnInit {

  @Input() icon: string;
  @Input() toolTip: string;
  @Input() toggled: boolean;
  @Input() label: string;
  @Output() onClick = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  public click() {
    // Forward click event
    this.onClick.emit();
  }
}

@Component({
  selector: 'viewer-buttons',
  template: `
  <div class="viewer-control-buttons" fxLayout="column" fxLayoutAlign="center center">
    <div class="label mat-caption">{{label}}</div>
    <div class="button-items">
      <ng-content select="viewer-button"></ng-content>
      <ng-content select="viewer-button-popup"></ng-content>
      <ng-content></ng-content>
    </div>
  </div>`,
  styleUrls: ['./widget-control-buttons.component.scss']
})
export class WidgetControlButtonsComponent implements OnInit {

  @Input() label: string;

  constructor() { }
  ngOnInit() { }
}

@Component({
  selector: 'viewer-button-popup',
  template: `
  <div class="position-relative">
    <viewer-button [toolTip]="toolTip" [label]="label" [toggled]="toggled" [icon]="icon" (click)="togglePopup()"></viewer-button>
    <div class="viewer-button-popup-content {{popupAlignment}}" *ngIf="popupShown">
      <ng-content selector="viewer-control-button"></ng-content>
    </div>
  </div>
  `,
  styleUrls: ['./widget-control-buttons.component.scss']
})
export class WidgetControlButtonComponent implements OnInit {

  @Input() toolTip: string;
  @Input() label: string;
  @Input() toggled: boolean;
  @Input() icon: string;
  @Input() popupAlignment: 'left' | 'right' = 'left';

  popupShown = false;

  constructor() { }

  ngOnInit() { }

  togglePopup() {
    this.popupShown = !this.popupShown;
  }
}
