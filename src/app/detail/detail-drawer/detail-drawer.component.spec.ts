import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDrawerComponent } from './detail-drawer.component';

describe('DetailDrawerComponent', () => {
  let component: DetailDrawerComponent;
  let fixture: ComponentFixture<DetailDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
