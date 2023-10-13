import { TestBed } from '@angular/core/testing';

import { PolygonEditorService } from './polygon-editor.service';

describe('PolygonEditorService', () => {
  let service: PolygonEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygonEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
