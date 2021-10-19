import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFieldsComponent } from './all-fields.component';
import { MatCardModule } from '@angular/material/card';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService } from 'src/mocks';

describe('AllFieldsComponent', () => {
  let component: AllFieldsComponent;
  let fixture: ComponentFixture<AllFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AllFieldsComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        MatCardModule
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
