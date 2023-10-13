import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPanelListComponent } from './map-panel-list.component';

describe('MapPanelListComponent', () => {
  let component: MapPanelListComponent;
  let fixture: ComponentFixture<MapPanelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPanelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
