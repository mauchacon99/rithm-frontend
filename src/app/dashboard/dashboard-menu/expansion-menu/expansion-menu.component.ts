import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
/**
 * Interface show data in expansion-panel.
 */
 interface InterfaceExpansionPanel {
  /** Organization type identifier. */
  Role:string,

  /** Title expansion-title. */
  title:string
}

/**
 * Expansion menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-expansion-menu',
  templateUrl: './expansion-menu.component.html',
  styleUrls: ['./expansion-menu.component.scss'],
})

export class ExpansionMenuComponent implements OnInit{

  /** Organization name. */
  @Input() organizationName!:string;

  /** Organization name. */
  dataExpansionPanel!:InterfaceExpansionPanel[];

  ngOnInit(): void {
    this.dataExpansionPanel = [
      {
        Role:'admin',
        title:`${this.organizationName} Dashboard`
      },
      {
        Role:'personal',
        title:'Personal Dashboard'
      }
    ];
  }

}
