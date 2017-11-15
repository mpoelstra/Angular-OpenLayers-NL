import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupObjectComponent } from './lookup-object.component';

describe('LookupObjectComponent', () => {
  let component: LookupObjectComponent;
  let fixture: ComponentFixture<LookupObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
