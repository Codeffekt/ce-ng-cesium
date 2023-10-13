import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPanelActionsComponent } from './map-panel-actions.component';

describe('MapPanelActionsComponent', () => {
  let component: MapPanelActionsComponent;
  let fixture: ComponentFixture<MapPanelActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPanelActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPanelActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
