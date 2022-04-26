import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLinkModalComponent } from './data-link-modal.component';

describe('DataLinkModalComponent', () => {
  let component: DataLinkModalComponent;
  let fixture: ComponentFixture<DataLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataLinkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
