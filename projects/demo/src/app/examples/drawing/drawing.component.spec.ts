import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingExampleComponent } from './drawing.component';

describe('DrawingComponent', () => {
  let component: DrawingExampleComponent;
  let fixture: ComponentFixture<DrawingExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
