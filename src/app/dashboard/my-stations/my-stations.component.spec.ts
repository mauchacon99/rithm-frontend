import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStationsComponent } from './my-stations.component';

describe('MyStationsComponent', () => {
  let component: MyStationsComponent;
  let fixture: ComponentFixture<MyStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyStationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
