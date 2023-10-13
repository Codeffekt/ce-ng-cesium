import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Component, Input, OnInit } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MapLayoutService } from "../map-layout.service";

@UntilDestroy()
@Component({
  selector: 'map-panel',
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.scss']
})
export class MapPanelComponent implements OnInit {

  @Input() width: number;

  private _panelExpanded: boolean;

  get panelExpanded(): boolean {
    return this._panelExpanded;
  }

  @Input()
  set panelExpanded(value: boolean) {
    this._panelExpanded = coerceBooleanProperty(value);
    this.mapLayoutService.setPanelExpanded(this._panelExpanded);
  }

  constructor(
    private mapLayoutService: MapLayoutService
  ) { }

  ngOnInit(): void {
    this.observePanelExpandedChanges();
  }

  togglePanel() {
    this.mapLayoutService.togglePanel();
  }

  private observePanelExpandedChanges() {
    this.mapLayoutService.panelExpandedChanges()
      .pipe(untilDestroyed(this))
      .subscribe(panelExpanded => this._panelExpanded = panelExpanded);
  }
}
