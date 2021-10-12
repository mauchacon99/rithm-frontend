import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateFieldsComponent } from './private-fields.component';

describe('PrivateFieldsComponent', () => {
  let component: PrivateFieldsComponent;
  let fixture: ComponentFixture<PrivateFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
