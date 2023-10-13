import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPanelBodyComponent } from './map-panel-body.component';

describe('MapPanelBodyComponent', () => {
  let component: MapPanelBodyComponent;
  let fixture: ComponentFixture<MapPanelBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPanelBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPanelBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
