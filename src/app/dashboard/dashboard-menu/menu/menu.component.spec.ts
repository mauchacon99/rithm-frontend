import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MockComponent } from 'ng-mocks';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { ExpansionMenuComponent } from '../expansion-menu/expansion-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MenuComponent,
        MockComponent(HeaderMenuComponent),
        MockComponent(OptionsMenuComponent),
        MockComponent(ExpansionMenuComponent),
      ],
      imports: [MatExpansionModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
