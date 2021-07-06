import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';

import { StationInfoHeaderComponent } from './station-info-header.component';

describe('StationInfoHeaderComponent', () => {
  let component: StationInfoHeaderComponent;
  let fixture: ComponentFixture<StationInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoHeaderComponent,
        MockComponent(RosterComponent)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
