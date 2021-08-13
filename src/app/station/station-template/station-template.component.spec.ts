import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationTemplateComponent } from './station-template.component';

describe('StationTemplateComponent', () => {
  let component: StationTemplateComponent;
  let fixture: ComponentFixture<StationTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
