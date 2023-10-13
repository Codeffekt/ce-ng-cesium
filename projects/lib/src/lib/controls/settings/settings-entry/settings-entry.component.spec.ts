import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsEntryComponent } from './settings-entry.component';

describe('SettingsEntryComponent', () => {
  let component: SettingsEntryComponent;
  let fixture: ComponentFixture<SettingsEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
