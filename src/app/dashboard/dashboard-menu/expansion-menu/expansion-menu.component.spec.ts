import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ExpansionMenuComponent } from './expansion-menu.component';
import { MockComponent } from 'ng-mocks';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';

describe('ExpansionMenuComponent', () => {
  let component: ExpansionMenuComponent;
  let fixture: ComponentFixture<ExpansionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExpansionMenuComponent,
        MockComponent(OptionsMenuComponent),
      ],
      imports: [MatExpansionModule, MatListModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
