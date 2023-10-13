import {
  Component, ContentChild,
  EventEmitter, Input, OnInit, Output, TemplateRef
} from '@angular/core';

@Component({
  selector: 'map-panel-list',
  templateUrl: './map-panel-list.component.html',
  styleUrls: ['./map-panel-list.component.scss']
})
export class MapPanelListComponent implements OnInit {

  @Input() items: any[];

  @Output() onHoverSelectEvent: EventEmitter<any> = new EventEmitter();  
  @Output() onSelectEvent: EventEmitter<any> = new EventEmitter();

  @ContentChild(TemplateRef) template: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

  selectItem(item: any) {
    this.onSelectEvent.emit(item);
  }

  onHoverSelectItem(item: any) {
    this.onHoverSelectEvent.emit(item);
  }

  onHoverClearItem() {
    this.onHoverSelectEvent.emit(undefined);
  }
}
