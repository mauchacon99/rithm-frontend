import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLinkFieldComponent } from './data-link-field.component';

describe('DataLinkFieldComponent', () => {
  let component: DataLinkFieldComponent;
  let fixture: ComponentFixture<DataLinkFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLinkFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLinkFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
