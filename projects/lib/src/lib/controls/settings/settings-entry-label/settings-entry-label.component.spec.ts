import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsEntryLabelComponent } from './settings-entry-label.component';

describe('SettingsEntryLabelComponent', () => {
  let component: SettingsEntryLabelComponent;
  let fixture: ComponentFixture<SettingsEntryLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsEntryLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsEntryLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
