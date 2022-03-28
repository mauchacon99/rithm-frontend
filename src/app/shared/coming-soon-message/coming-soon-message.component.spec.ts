import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingSoonMessageComponent } from './coming-soon-message.component';

describe('ComingSoonMessageComponent', () => {
  let component: ComingSoonMessageComponent;
  let fixture: ComponentFixture<ComingSoonMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComingSoonMessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingSoonMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
