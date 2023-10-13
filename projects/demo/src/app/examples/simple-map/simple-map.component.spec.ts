import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMapExampleConponent } from './simple-map.component';

describe('HomeComponent', () => {
  let component: SimpleMapExampleConponent;
  let fixture: ComponentFixture<SimpleMapExampleConponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMapExampleConponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMapExampleConponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
