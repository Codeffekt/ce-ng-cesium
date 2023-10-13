import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CesiumDrawingControlsComponent } from './cesium-drawing-controls.component';

describe('CesiumDrawingControlsComponent', () => {
  let component: CesiumDrawingControlsComponent;
  let fixture: ComponentFixture<CesiumDrawingControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CesiumDrawingControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CesiumDrawingControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
