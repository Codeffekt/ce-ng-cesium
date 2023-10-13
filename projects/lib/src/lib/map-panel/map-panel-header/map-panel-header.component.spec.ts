import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPanelHeaderComponent } from './map-panel-header.component';

describe('MapPanelHeaderComponent', () => {
  let component: MapPanelHeaderComponent;
  let fixture: ComponentFixture<MapPanelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPanelHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
