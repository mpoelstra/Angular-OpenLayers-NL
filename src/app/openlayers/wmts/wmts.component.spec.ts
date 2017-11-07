import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmtsComponent } from './wmts.component';

describe('WmtsComponent', () => {
  let component: WmtsComponent;
  let fixture: ComponentFixture<WmtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
