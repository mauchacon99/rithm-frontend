import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivateFieldsComponent } from './private-fields.component';
import { MatCardModule } from '@angular/material/card';

describe('PrivateFieldsComponent', () => {
  let component: PrivateFieldsComponent;
  let fixture: ComponentFixture<PrivateFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrivateFieldsComponent
      ],
      imports: [
        MatCardModule
      ],
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
